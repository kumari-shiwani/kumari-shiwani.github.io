import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { boards, chapters, texSrc, thumbSrc } from '../lib/data'
import { clothFragment, clothVertex } from './clothShader'
import { Intro } from './Intro'
import {
  boardS,
  chapterS,
  chapterAt,
  dzOf,
  GAP,
  nearestBoard,
  sForProgress,
  S_END,
  S_START,
  W,
  yOf,
  zOf,
} from './layout'

const PAPER = '#ebe6db'
const INK = '#171512'
const THREAD = '#c8302a'
const SUN = '#ecdc66'

const raw = (hex: string) => {
  const n = parseInt(hex.slice(1), 16)
  return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255)
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
const damp = (a: number, b: number, k: number, dt: number) => a + (b - a) * (1 - Math.exp(-k * dt))
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

const P = (s: number, out = new THREE.Vector3()) => out.set(s, yOf(s), zOf(s))
const T = (s: number, out = new THREE.Vector3()) => out.set(1, 0, dzOf(s)).normalize()
const N = (s: number, out = new THREE.Vector3()) => out.set(-dzOf(s), 0, 1).normalize()

export type EngineEvents = {
  onLoadProgress: (p: number) => void
  onReady: () => void
  onFocus: (index: number) => void
  onChapter: (chapter: number) => void
  onHover: (index: number | null) => void
  onOpen: (index: number) => void
  onPick: (index: number) => void
  onIntro: (stage: number) => void
}

// a whisper of each collection's palette in the air
const TINTS = [
  '#efdedd', '#e4e0e9', '#efe4cc', '#e3e7e2', '#dfe4e9', '#e8e1ea',
  '#f0dfe4', '#e4e3e0', '#dee2ea', '#dde7df', '#e2e6db',
]

type BoardObj = {
  mesh: THREE.Mesh
  uniforms: Record<string, THREE.IUniform>
  lineQuat: THREE.Quaternion
  linePos: THREE.Vector3
  cylQuat: THREE.Quaternion
  cylPos: THREE.Vector3
  prevPos: THREE.Vector3
  delay: number
  thumb?: THREE.Texture
  hi?: THREE.Texture
  hiLoading: boolean
  hover: number
  force: number
}

export class Engine {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera: THREE.PerspectiveCamera
  private clock = new THREE.Clock()
  private boards: BoardObj[] = []
  private pegs!: THREE.InstancedMesh
  private shadows!: THREE.InstancedMesh
  private threadMat!: THREE.MeshBasicMaterial
  private discs: THREE.Mesh[] = []
  private sun!: THREE.Mesh
  private lint!: THREE.LineSegments
  private raycaster = new THREE.Raycaster()
  private pointer = new THREE.Vector2(-10, -10)
  private pointerN = new THREE.Vector2(0, 0)
  private pointerSpeed = 0
  private hovered: number | null = null
  private pointerIsTouch = false
  /** a finger on the glass plays the role of the laptop cursor */
  private touchActive = false
  private touchOnCanvas = false
  /** camera sway: the mouse on a laptop, the finger (or a slow breath) on touch screens */
  private par = new THREE.Vector2()
  /** touch screens have no resting cursor, so an air current plays its part */
  private touchDevice = window.matchMedia('(hover: none)').matches
  private overCanvas = false
  private clientX = -1
  private clientY = -1
  private frame = 0
  private anisotropy = 8
  private texLoader = new THREE.TextureLoader()
  private raf = 0
  private disposed = false

  private sCam = S_START - 3
  private sPrevCam = S_START - 3
  private wind = 0
  private heroT = 0
  private introT = 0
  private introStage = -2
  private intro!: Intro
  private tint = raw(PAPER)
  private tintTarget = raw(PAPER)
  private tintColor = new THREE.Color()
  private lastScrollTime = 0
  private progress = 0
  private focus = -1
  private chapter = -2
  private labelEls: (HTMLElement | null)[] = []
  private progressEl: HTMLElement | null = null

  private indexTarget = 0
  private indexMix = 0
  private indexCenter = new THREE.Vector3()
  private yaw = 0
  private yawTarget = 0
  private pitch = 0
  private dragging = false
  private dragX = 0
  private downAt = { x: 0, y: 0, t: 0 }

  private camPos = new THREE.Vector3()
  private camLook = new THREE.Vector3()
  private reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  private fogNear = 7
  private fogFar = 24

  constructor(
    private canvas: HTMLCanvasElement,
    private ev: EngineEvents,
  ) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(window.innerWidth, window.innerHeight, false)
    this.renderer.setClearColor(PAPER)
    this.anisotropy = Math.min(8, this.renderer.capabilities.getMaxAnisotropy())

    this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.05, 120)
    this.scene.background = new THREE.Color(PAPER)
    this.scene.fog = new THREE.Fog(PAPER, this.fogNear, this.fogFar)

    this.scene.add(new THREE.HemisphereLight('#fffaf0', '#b9b2a3', 1.6))
    const sun = new THREE.DirectionalLight('#ffffff', 1.4)
    sun.position.set(-3, 5, 4)
    this.scene.add(sun)

    this.buildBoards()
    this.buildThread()
    this.buildPegs()
    this.buildShadows()
    this.buildDiscs()
    this.intro = new Intro(this.scene, THREAD)
    this.placeSun()
    this.buildLint()
    this.loadThumbs()

    this.bind()
    this.onScroll()
    this.sCam = this.targetS()
    this.sPrevCam = this.sCam
    this.heroT = this.computeHeroT()
    this.loop()
  }

  // ───────────────────────────────── build ──
  private buildBoards() {
    const geo = new THREE.PlaneGeometry(W, 1, 64, 22)
    geo.translate(0, -0.5, 0)
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, -0.5, 0), W / 2 + 1)
    const placeholder = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1)
    placeholder.needsUpdate = true

    const tmpN = new THREE.Vector3()
    boards.forEach((_, i) => {
      const s = boardS[i]
      const uniforms: Record<string, THREE.IUniform> = {
        uTime: { value: 0 },
        uSeed: { value: Math.random() },
        uWind: { value: 0 },
        uFlutter: { value: 0 },
        uHover: { value: 0 },
        uPointer: { value: new THREE.Vector2(0, -0.5) },
        uPointerForce: { value: 0 },
        uWidth: { value: W },
        uCalm: { value: this.reduced ? 0.3 : 1 },
        uMap: { value: placeholder },
        uReady: { value: 0 },
        uOpacity: { value: 1 },
        uPaper: { value: raw('#f6f3ec') },
        uThread: { value: raw(THREAD) },
        uFogColor: { value: raw(PAPER) },
        uFogNear: { value: this.fogNear },
        uFogFar: { value: this.fogFar },
      }
      const mat = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: clothVertex,
        fragmentShader: clothFragment,
        side: THREE.DoubleSide,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.userData.index = i
      const linePos = P(s)
      const yaw = -Math.atan(dzOf(s))
      const lineQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw)
      // hang slightly in front of the thread so pegs clip both
      linePos.add(N(s, tmpN).multiplyScalar(0.012))
      mesh.position.copy(linePos)
      mesh.quaternion.copy(lineQuat)
      this.scene.add(mesh)
      this.boards.push({
        mesh,
        uniforms,
        linePos,
        lineQuat,
        cylPos: new THREE.Vector3(),
        cylQuat: new THREE.Quaternion(),
        prevPos: linePos.clone(),
        delay: 0,
        hiLoading: false,
        hover: 0,
        force: 0,
      })
    })
  }

  private buildThread() {
    const a = 0.36 * W
    type Anchor = { s: number; p: THREE.Vector3; k: 'run' | 'L' | 'R' }
    const anchors: Anchor[] = []
    const tmpT = new THREE.Vector3()
    const startS = S_START - 46
    for (let s = startS; s < boardS[0] - a - 3; s += 4.5) anchors.push({ s, p: P(s), k: 'run' })
    boardS.forEach((s) => {
      T(s, tmpT)
      anchors.push({ s: s - a, p: P(s).addScaledVector(tmpT, -a), k: 'L' })
      anchors.push({ s: s + a, p: P(s).addScaledVector(tmpT, a), k: 'R' })
    })
    for (let s = S_END + a + 4; s < S_END + 34; s += 4.5) anchors.push({ s, p: P(s), k: 'run' })

    const pts: THREE.Vector3[] = []
    const base = new THREE.Vector3()
    const off = new THREE.Vector3()
    const offB = new THREE.Vector3()
    for (let k = 0; k < anchors.length - 1; k++) {
      const A = anchors[k]
      const B = anchors[k + 1]
      const L = B.s - A.s
      const sag =
        A.k === 'L' && B.k === 'R' ? 0.004 : A.k === 'run' || B.k === 'run' ? 0.015 : Math.min(0.32, 0.022 * L * L)
      const steps = Math.max(2, Math.ceil(L / 0.12))
      off.copy(A.p).sub(P(A.s, base))
      offB.copy(B.p).sub(P(B.s, base))
      for (let j = 0; j < steps; j++) {
        const u = j / steps
        const s = A.s + L * u
        const p = P(s).add(base.copy(off).lerp(offB, u))
        p.y -= 4 * sag * u * (1 - u)
        pts.push(p)
      }
    }
    pts.push(anchors[anchors.length - 1].p.clone())
    const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal')
    const geo = new THREE.TubeGeometry(curve, pts.length, 0.0075, 5, false)
    this.threadMat = new THREE.MeshBasicMaterial({ color: THREAD, transparent: true })
    const mesh = new THREE.Mesh(geo, this.threadMat)
    mesh.frustumCulled = false
    this.scene.add(mesh)
  }

  private buildPegs() {
    const prong = new THREE.BoxGeometry(0.034, 0.21, 0.016)
    const p1 = prong.clone().translate(0, -0.035, 0.012)
    const p2 = prong.clone().translate(0, -0.035, -0.012)
    const spring = new THREE.CylinderGeometry(0.014, 0.014, 0.05, 10).rotateX(Math.PI / 2).translate(0, 0.012, 0)
    const geo = mergeGeometries([p1, p2, spring])!
    const mat = new THREE.MeshLambertMaterial({ color: '#ffffff' })
    this.pegs = new THREE.InstancedMesh(geo, mat, boards.length * 2)
    this.pegs.frustumCulled = false
    const palette = ['#cdb08a', '#cdb08a', '#c9a77c', '#e9d86a', '#e6a7b4', '#9dbfd8', '#a9c6a3']
    const c = new THREE.Color()
    for (let i = 0; i < boards.length * 2; i++) {
      this.pegs.setColorAt(i, c.set(palette[Math.floor(Math.random() * palette.length)]))
    }
    this.scene.add(this.pegs)
  }

  private buildShadows() {
    const cv = document.createElement('canvas')
    cv.width = 128
    cv.height = 64
    const g = cv.getContext('2d')!
    g.filter = 'blur(10px)'
    g.fillStyle = '#000'
    g.fillRect(22, 18, 84, 28)
    const tex = new THREE.CanvasTexture(cv)
    const mat = new THREE.MeshBasicMaterial({
      color: INK,
      alphaMap: tex,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
    })
    const geo = new THREE.PlaneGeometry(W * 1.5, 1.2).rotateX(-Math.PI / 2)
    this.shadows = new THREE.InstancedMesh(geo, mat, boards.length)
    this.shadows.frustumCulled = false
    this.scene.add(this.shadows)
  }

  private buildDiscs() {
    const geo = new THREE.CircleGeometry(1, 96)
    const n = new THREE.Vector3()
    chapters.forEach((_, c) => {
      const s = chapterS[c]
      const mat = new THREE.MeshBasicMaterial({ color: SUN, transparent: true })
      const m = new THREE.Mesh(geo, mat)
      N(s, n)
      m.position.copy(P(s)).addScaledVector(n, -0.12)
      m.position.y -= 0.45
      m.scale.setScalar(1.05)
      this.scene.add(m)
      this.discs.push(m)
    })
    // the big hero sun
    const sunMat = new THREE.MeshBasicMaterial({ color: SUN, fog: false, transparent: true })
    const sun = new THREE.Mesh(geo, sunMat)
    sun.scale.setScalar(5)
    this.scene.add(sun)
    this.sun = sun
    this.placeSun()
    this.discs.push(sun)
  }

  private buildLint() {
    const count = 340
    const pos = new Float32Array(count * 2 * 3)
    const seed = new Float32Array(count * 2 * 3)
    for (let i = 0; i < count; i++) {
      const cx = Math.random() * 40
      const cy = Math.random() * 7
      const cz = Math.random() * 16
      const dir = new THREE.Vector3().randomDirection().multiplyScalar(0.025 + Math.random() * 0.04)
      for (let e = 0; e < 2; e++) {
        const k = (i * 2 + e) * 3
        seed[k] = cx
        seed[k + 1] = cy
        seed[k + 2] = cz
        pos[k] = e ? dir.x : -dir.x
        pos[k + 1] = e ? dir.y : -dir.y
        pos[k + 2] = e ? dir.z : -dir.z
      }
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('aCenter', new THREE.BufferAttribute(seed, 3))
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uCam: { value: new THREE.Vector3() },
        uColor: { value: raw('#7d766a') },
        uFog: { value: raw(PAPER) },
      },
      vertexShader: /* glsl */ `
        attribute vec3 aCenter;
        uniform float uTime;
        uniform vec3 uCam;
        varying float vD;
        void main() {
          vec3 box = vec3(40.0, 7.0, 16.0);
          vec3 drift = vec3(uTime * 0.12, sin(uTime * 0.3 + aCenter.x) * 0.25 - uTime * 0.03, cos(uTime * 0.2 + aCenter.y) * 0.3);
          vec3 c = mod(aCenter + drift - uCam + box * 0.5, box) - box * 0.5 + uCam;
          c.y = mod(aCenter.y + drift.y, box.y) - 2.8;
          float a = uTime * 0.6 + aCenter.z;
          vec3 p = position;
          p.xy = mat2(cos(a), -sin(a), sin(a), cos(a)) * p.xy;
          vec4 mv = modelViewMatrix * vec4(c + p, 1.0);
          vD = -mv.z;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        uniform vec3 uFog;
        varying float vD;
        void main() {
          float f = smoothstep(2.0, 16.0, vD);
          gl_FragColor = vec4(mix(uColor, uFog, f), 0.55 * (1.0 - f));
        }`,
    })
    this.lint = new THREE.LineSegments(geo, mat)
    this.lint.frustumCulled = false
    this.scene.add(this.lint)
  }

  private placeSun() {
    const pos = new THREE.Vector3()
    const look = new THREE.Vector3()
    const px = this.pointerN.clone()
    const it = this.introT
    this.pointerN.set(0, 0)
    this.introT = 0
    this.heroCamera(pos, look)
    this.introT = it
    this.pointerN.copy(px)
    const fwd = look.clone().sub(pos).normalize()
    const right = new THREE.Vector3().crossVectors(fwd, new THREE.Vector3(0, 1, 0)).normalize()
    const portrait = this.camera.aspect < 1
    this.sun.position
      .copy(pos)
      .addScaledVector(fwd, 34)
      .addScaledVector(right, portrait ? 2 : 9)
      .add(new THREE.Vector3(0, portrait ? 7 : 5.5, 0))
    this.intro?.setFrame(pos, look, this.camera.aspect, this.sun.position)
  }


  // ─────────────────────────────── textures ──
  private prepTex(t: THREE.Texture) {
    t.anisotropy = this.anisotropy
    t.minFilter = THREE.LinearMipmapLinearFilter
    t.magFilter = THREE.LinearFilter
    t.generateMipmaps = true
    return t
  }

  private loadThumbs() {
    let done = 0
    const total = this.boards.length
    const order = this.boards.map((_, i) => i)
    order.forEach((i) => {
      const b = this.boards[i]
      this.texLoader.load(
        thumbSrc(boards[i].page),
        (t) => {
          if (this.disposed) return t.dispose()
          b.thumb = this.prepTex(t)
          if (!b.hi) b.uniforms.uMap.value = t
          done++
          this.ev.onLoadProgress(done / total)
          if (done === total) this.ev.onReady()
        },
        undefined,
        () => {
          done++
          this.ev.onLoadProgress(done / total)
          if (done === total) this.ev.onReady()
        },
      )
    })
  }

  private streamHi() {
    const f = this.focus >= 0 ? this.focus : nearestBoard(this.sCam).index
    const near = window.innerWidth < 800 ? 3 : 5
    let started = 0
    this.boards.forEach((b, i) => {
      const d = Math.abs(i - f)
      if (d <= near && !b.hi && !b.hiLoading && started < 2 && this.indexMix < 0.5) {
        b.hiLoading = true
        started++
        this.texLoader.load(
          texSrc(boards[i].page),
          (t) => {
            b.hiLoading = false
            if (this.disposed) return t.dispose()
            b.hi = this.prepTex(t)
            b.uniforms.uMap.value = t
          },
          undefined,
          () => (b.hiLoading = false),
        )
      } else if (d > near + 4 && b.hi) {
        b.uniforms.uMap.value = b.thumb ?? b.uniforms.uMap.value
        b.hi.dispose()
        b.hi = undefined
      }
    })
  }

  // ───────────────────────────────── input ──
  private onResize = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.placeSun()
  }

  private onScroll = () => {
    const work = document.getElementById('work')
    if (!work) return
    const top = work.offsetTop
    const len = Math.max(1, work.offsetHeight - window.innerHeight)
    this.progress = clamp((window.scrollY - top) / len, 0, 1)
    this.lastScrollTime = performance.now()
  }

  /** 0..1 over everything above the line (hero + intro act) */
  private preT() {
    const work = document.getElementById('work')
    const top = work ? work.offsetTop : window.innerHeight
    return clamp(window.scrollY / Math.max(1, top), 0, 1)
  }
  private computeHeroT() {
    return clamp((this.preT() - 0.82) / 0.18, 0, 1)
  }
  private computeIntroT() {
    return clamp((this.preT() - 0.06) / 0.8, 0, 1)
  }

  private onPointerMove = (e: PointerEvent) => {
    this.pointerIsTouch = e.pointerType === 'touch'
    this.overCanvas = e.target === this.canvas
    this.clientX = e.clientX
    this.clientY = e.clientY
    const nx = (e.clientX / window.innerWidth) * 2 - 1
    const ny = -(e.clientY / window.innerHeight) * 2 + 1
    const dx = nx - this.pointer.x
    const dy = ny - this.pointer.y
    this.pointerSpeed = Math.min(1.5, this.pointerSpeed + Math.hypot(dx, dy) * 6)
    this.pointer.set(nx, ny)
    this.pointerN.set(nx, ny)
    if (this.dragging && this.indexTarget === 1) {
      this.yawTarget -= (e.clientX - this.dragX) * 0.0045
      this.dragX = e.clientX
    }
  }

  private onPointerDown = (e: PointerEvent) => {
    if (!(e.target instanceof HTMLCanvasElement) && !(e.target as HTMLElement).closest?.('[data-pass]')) return
    this.downAt = { x: e.clientX, y: e.clientY, t: performance.now() }
    this.dragging = true
    this.dragX = e.clientX
    this.pointer.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1)
  }

  private onPointerUp = (e: PointerEvent) => {
    const wasDragging = this.dragging
    this.dragging = false
    if (!wasDragging) return
    const moved = Math.hypot(e.clientX - this.downAt.x, e.clientY - this.downAt.y)
    if (moved > 8 || performance.now() - this.downAt.t > 600) return
    this.pointer.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1)
    const hit = this.pick()
    if (hit === null) return
    if (this.indexTarget === 1) this.ev.onPick(hit)
    else this.ev.onOpen(hit)
  }

  private onPointerCancel = () => {
    this.dragging = false
  }

  private onTouch = (e: TouchEvent) => {
    const t = e.touches[0]
    if (!t) return
    this.pointerIsTouch = true
    this.touchActive = true
    this.touchOnCanvas = e.target === this.canvas
    this.clientX = t.clientX
    this.clientY = t.clientY
    const nx = (t.clientX / window.innerWidth) * 2 - 1
    const ny = -(t.clientY / window.innerHeight) * 2 + 1
    if (e.type === 'touchmove') this.pointerSpeed = Math.min(1.5, this.pointerSpeed + Math.hypot(nx - this.pointer.x, ny - this.pointer.y) * 6)
    this.pointer.set(nx, ny)
    this.pointerN.set(nx, ny)
  }
  private onTouchEnd = (e: TouchEvent) => {
    if (e.touches.length === 0) this.touchActive = false
  }

  private onWheel = (e: WheelEvent) => {
    if (this.indexTarget !== 1) return
    e.preventDefault()
    this.yawTarget += (e.deltaY + e.deltaX) * 0.0016
  }

  private bind() {
    window.addEventListener('resize', this.onResize)
    window.addEventListener('scroll', this.onScroll, { passive: true })
    window.addEventListener('pointermove', this.onPointerMove)
    window.addEventListener('pointerdown', this.onPointerDown)
    window.addEventListener('pointerup', this.onPointerUp)
    window.addEventListener('pointercancel', this.onPointerCancel)
    window.addEventListener('wheel', this.onWheel, { passive: false })
    window.addEventListener('touchstart', this.onTouch, { passive: true })
    window.addEventListener('touchmove', this.onTouch, { passive: true })
    window.addEventListener('touchend', this.onTouchEnd, { passive: true })
    window.addEventListener('touchcancel', this.onTouchEnd, { passive: true })
  }

  private pick(): number | null {
    if (this.heroT < 0.6 && this.indexMix < 0.5) return null
    this.raycaster.setFromCamera(this.pointer, this.camera)
    const hits = this.raycaster.intersectObjects(
      this.boards.map((b) => b.mesh),
      false,
    )
    const h = hits[0]
    if (!h || h.distance > 16) return null
    const i = h.object.userData.index as number
    if (h.uv) {
      this.boards[i].uniforms.uPointer.value.set((h.uv.x - 0.5) * W, h.uv.y - 1)
    }
    return i
  }

  // ──────────────────────────────── public ──
  setLabels(els: (HTMLElement | null)[]) {
    this.labelEls = els
  }
  setProgressEl(el: HTMLElement | null) {
    this.progressEl = el
  }

  setIndex(on: boolean) {
    if (on && this.indexTarget === 0) {
      this.indexCenter.copy(this.camPos)
      const dir = this.camLook.clone().sub(this.camPos)
      this.yaw = Math.atan2(dir.x, -dir.z)
      this.yawTarget = this.yaw
      this.layoutCylinder()
    }
    this.indexTarget = on ? 1 : 0
  }

  /** jump the camera straight to a board (used when leaving the index) */
  snapTo(index: number) {
    this.sCam = boardS[index]
    this.sPrevCam = this.sCam
  }

  private layoutCylinder() {
    const cols = 14
    const R = 10
    const rowH = 1.16
    const rows = Math.ceil(this.boards.length / cols)
    const f = Math.max(0, this.focus >= 0 ? this.focus : nearestBoard(this.sCam).index)
    const fc = f % cols
    const y0 = this.indexCenter.y + (rows * rowH) / 2 - 0.08
    this.boards.forEach((b, i) => {
      const col = i % cols
      const row = Math.floor(i / cols)
      const a = this.yaw + ((col - fc) / cols) * Math.PI * 2
      b.cylPos.set(
        this.indexCenter.x + Math.sin(a) * R,
        y0 - row * rowH,
        this.indexCenter.z - Math.cos(a) * R,
      )
      b.cylQuat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -a)
      const dCol = Math.min(Math.abs(col - fc), cols - Math.abs(col - fc))
      b.delay = clamp((dCol / (cols / 2)) * 0.38 + row * 0.03 + Math.random() * 0.05, 0, 0.5)
    })
  }

  // ───────────────────────────────── frame ──
  private targetS() {
    const raw = sForProgress(this.progress)
    const idle = performance.now() - this.lastScrollTime > 160
    if (!idle || this.progress >= 1) return raw
    if (this.progress <= 0 && this.computeHeroT() < 1) return raw
    // at rest the camera always settles on something: a board, or a collection title in the gap
    const { index, dist } = nearestBoard(raw)
    if (dist < (W + GAP) / 2 + 0.05) return boardS[index]
    let c = 0
    for (let i = 1; i < chapterS.length; i++) if (Math.abs(chapterS[i] - raw) < Math.abs(chapterS[c] - raw)) c = i
    return Math.abs(chapterS[c] - raw) < 3.5 ? chapterS[c] : raw
  }

  private trackCamera(s: number, pos: THREE.Vector3, look: THREE.Vector3) {
    const aspect = this.camera.aspect
    const vfov = THREE.MathUtils.degToRad(this.camera.fov)
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * aspect)
    const portrait = aspect < 1
    const want = portrait ? W * 1.32 : W * 1.5
    const dist = clamp(want / 2 / Math.tan(hfov / 2), 3.1, 12)
    const p = P(s)
    p.y -= 0.5
    const t = T(s)
    const n = N(s)
    const px = this.par.x
    const py = this.par.y
    pos
      .copy(p)
      .addScaledVector(n, dist)
      .addScaledVector(t, -dist * (portrait ? 0.16 : 0.3) + px * 0.25)
    pos.y += 0.16 + py * 0.14
    look.copy(p).addScaledVector(t, dist * (portrait ? 0.05 : 0.09))
    look.y -= 0.02
  }

  private heroCamera(pos: THREE.Vector3, look: THREE.Vector3) {
    const s = S_START - 2
    const p = P(s)
    const n = N(s)
    const t = T(s)
    const portrait = this.camera.aspect < 1
    // portrait keeps the laptop's receding diagonal, just pulled back to fit the narrow frame
    look.copy(P(s + (portrait ? 9.5 : 8.5)))
    look.y -= portrait ? 1.7 + clamp(this.camera.aspect - 0.46, 0, 0.16) * 4 : 1.05
    pos
      .copy(p)
      .addScaledVector(n, portrait ? 9.5 : 7.2)
      .addScaledVector(t, portrait ? -3.4 : -4.2)
    pos.y += 1.3 + this.par.y * 0.25
    pos.x += this.par.x * 0.4
    if (this.introT > 0) {
      const f = look.clone().sub(pos).normalize()
      pos.addScaledVector(f, Math.sin(Math.min(1, this.introT) * Math.PI * 0.5) * 0.9)
    }
  }

  private tmpA = new THREE.Vector3()
  private tmpB = new THREE.Vector3()
  private tmpC = new THREE.Vector3()
  private tmpD = new THREE.Vector3()
  private tmpQ = new THREE.Quaternion()
  private tmpM = new THREE.Matrix4()
  private tmpS = new THREE.Vector3(1, 1, 1)
  private pegOff = new THREE.Vector3()
  private lookI = new THREE.Vector3()
  private paused = false

  setPaused(p: boolean) {
    this.paused = p
    if (p && this.hovered !== null) {
      this.hovered = null
      this.ev.onHover(null)
    }
  }

  private loop = () => {
    if (this.disposed) return
    this.raf = requestAnimationFrame(this.loop)
    const dt = Math.min(this.clock.getDelta(), 1 / 20)
    const time = this.clock.elapsedTime
    if (this.paused) return

    const work = document.getElementById('work')
    if (work) {
      const coveredFrom = work.offsetTop + work.offsetHeight
      if (window.scrollY > coveredFrom + 40 && this.indexTarget === 0 && this.indexMix < 0.001) {
        if (this.hovered !== null) {
          this.hovered = null
          this.ev.onHover(null)
        }
        return
      }
    }

    // scroll & hero
    this.heroT = damp(this.heroT, this.computeHeroT(), 5, dt)
    this.introT = damp(this.introT, this.computeIntroT(), 4, dt)
    if (Math.abs(this.introT - this.computeIntroT()) < 0.0005) this.introT = this.computeIntroT()
    if (this.pointerIsTouch) {
      // finger drives the sway while it is down; otherwise a slow breath, like a resting mouse
      const tx = this.touchActive ? this.pointerN.x * 0.25 : Math.sin(time * 0.21) * 0.3
      const ty = this.touchActive ? this.pointerN.y * 0.25 : Math.sin(time * 0.15 + 1) * 0.2
      this.par.set(damp(this.par.x, tx, 1.6, dt), damp(this.par.y, ty, 1.6, dt))
    } else this.par.copy(this.pointerN)
    const target = this.targetS()
    this.sCam = damp(this.sCam, target, this.indexTarget ? 12 : 3.4, dt)
    const vel = (this.sCam - this.sPrevCam) / Math.max(dt, 1e-4)
    this.sPrevCam = this.sCam
    this.wind = damp(this.wind, clamp(vel * 0.05, -1.3, 1.3), 4, dt)
    if (this.reduced) this.wind *= 0.3

    this.indexMix = damp(this.indexMix, this.indexTarget, this.indexTarget ? 1.9 : 2.4, dt)
    if (Math.abs(this.indexMix - this.indexTarget) < 0.0005) this.indexMix = this.indexTarget
    const im = this.indexMix

    // camera
    const tp = this.tmpA
    const tl = this.tmpB
    this.trackCamera(this.sCam, tp, tl)
    const hp = this.tmpC
    const hl = this.tmpD
    this.heroCamera(hp, hl)
    const h = ease(clamp(this.heroT, 0, 1))
    tp.lerpVectors(hp, tp, h)
    tl.lerpVectors(hl, tl, h)

    if (im > 0) {
      this.yaw = damp(this.yaw, this.yawTarget, 6, dt)
      if (!this.dragging && !this.pointerIsTouch) this.yawTarget += this.pointerN.x * 0.35 * dt * (this.pointerN.x ** 2 > 0.36 ? 1 : 0)
      this.pitch = damp(this.pitch, this.pointerIsTouch ? 0 : this.pointerN.y * 0.22, 3, dt)
      const e = ease(im)
      const ip = this.indexCenter
      const lookI = this.lookI.set(
        ip.x + Math.sin(this.yaw) * Math.cos(this.pitch) * 8,
        ip.y + Math.sin(this.pitch) * 8,
        ip.z - Math.cos(this.yaw) * Math.cos(this.pitch) * 8,
      )
      tp.lerp(ip, e)
      tl.lerp(lookI, e)
    }
    this.camPos.copy(tp)
    this.camLook.copy(tl)
    this.camera.position.copy(tp)
    this.camera.lookAt(tl)
    const fovTarget = 40 + im * 18 - (1 - h) * 4
    if (Math.abs(this.camera.fov - fovTarget) > 0.01) {
      this.camera.fov = fovTarget
      this.camera.updateProjectionMatrix()
    }

    // fog widens in the archive
    const fn = THREE.MathUtils.lerp(7 + (1 - h) * 6, 14, im)
    const ff = THREE.MathUtils.lerp(24 + (1 - h) * 10, 32, im)
    const fog = this.scene.fog as THREE.Fog
    fog.near = fn
    fog.far = ff

    // hover
    if (++this.frame % 6 === 0 && this.clientX >= 0) {
      this.overCanvas = document.elementFromPoint(this.clientX, this.clientY) === this.canvas
    }
    let hov: number | null = null
    if (!this.pointerIsTouch && !this.dragging && this.overCanvas) hov = this.pick()
    else if ((this.touchDevice || this.pointerIsTouch) && im > 0.9) {
      // no hover on glass: in the archive the board facing you is the one that gets named
      const keep = this.pointer.clone()
      this.pointer.set(0, -0.05)
      hov = this.pick()
      this.pointer.copy(keep)
    }
    if (hov !== this.hovered) {
      this.hovered = hov
      this.ev.onHover(hov)
    }
    // the cloth answers a finger exactly as it answers the cursor (without the hover UI)
    const felt = hov ?? (this.pointerIsTouch && this.touchActive && this.touchOnCanvas && im < 0.5 ? this.pick() : null)
    this.pointerSpeed = damp(this.pointerSpeed, 0, 3, dt)

    // the line steps aside while the knitting act plays
    const lh = this.intro.lineHide(this.introT) * (1 - this.heroT)
    const lineOp = 1 - lh
    const pegMat = this.pegs.material as THREE.MeshLambertMaterial
    pegMat.transparent = lineOp < 0.999
    pegMat.opacity = lineOp
    this.pegs.visible = lineOp > 0.01

    // air current (touch screens): a gusting breeze on every board, and on the board in
    // front a slow drifting ripple with a breathing lift, as a resting laptop cursor gives
    const airOn = (this.touchDevice || this.pointerIsTouch) && !(this.touchActive && felt !== null)
    const calm = this.reduced ? 0.3 : 1
    const breeze = airOn ? (0.12 * Math.sin(time * 0.23) + 0.4 * Math.max(0, Math.sin(time * 0.33)) ** 2 + 0.12) * calm : 0
    const airI = airOn && this.heroT > 0.6 && im < 0.5 ? this.focus : -1

    // boards
    let pegI = 0
    this.boards.forEach((b, i) => {
      const u = b.uniforms
      let e = 0
      if (im > 0) e = ease(clamp((im * 1.5 - b.delay) / 1.0, 0, 1))
      const m = b.mesh
      if (e > 0) {
        m.position.lerpVectors(b.linePos, b.cylPos, e)
        m.position.y += Math.sin(e * Math.PI) * 0.9
        m.quaternion.slerpQuaternions(b.lineQuat, b.cylQuat, e)
      } else {
        m.position.copy(b.linePos)
        m.quaternion.copy(b.lineQuat)
      }
      const speed = m.position.distanceTo(b.prevPos) / Math.max(dt, 1e-4)
      b.prevPos.copy(m.position)

      const isH = felt === i
      const isAir = !isH && i === airI
      if (isAir) u.uPointer.value.set(Math.sin(time * 0.41 + i) * 0.3 * W, -0.45 + Math.sin(time * 0.57) * 0.22)
      const hT = isH ? 1 : isAir ? 0.8 + 0.2 * Math.sin(time * 0.8) : 0
      const fT = isH ? 0.35 + Math.min(this.pointerSpeed, 1) * 0.9 : isAir ? 0.65 + 0.25 * Math.sin(time * 1.1) : 0
      b.hover = damp(b.hover, hT, isAir ? 2 : 6, dt)
      b.force = damp(b.force, fT, isH ? 5 : 2, dt)

      u.uOpacity.value = lineOp
      const bm = m.material as THREE.ShaderMaterial
      bm.transparent = lineOp < 0.999
      m.visible = lineOp > 0.01
      u.uTime.value = time
      u.uWind.value = (this.wind + breeze) * (1 - e)
      u.uFlutter.value = Math.min(speed * 0.06, 1.4)
      u.uHover.value = b.hover
      u.uPointerForce.value = this.reduced ? b.force * 0.3 : b.force
      u.uFogNear.value = fn
      u.uFogFar.value = ff
      if (b.thumb && u.uReady.value < 1) u.uReady.value = Math.min(1, u.uReady.value + dt * 2)

      // pegs follow the board's top corners
      m.updateMatrix()
      for (const side of [-1, 1]) {
        this.pegOff.set(side * 0.36 * W, 0, 0.004)
        this.tmpM.compose(this.pegOff, this.tmpQ.identity(), this.tmpS)
        this.tmpM.premultiply(m.matrix)
        this.pegs.setMatrixAt(pegI++, this.tmpM)
      }
      // soft floor shadow
      this.tmpM.makeRotationFromQuaternion(m.quaternion)
      this.tmpM.setPosition(m.position.x, -2.15 - e * 3, m.position.z - 0.35)
      this.shadows.setMatrixAt(i, this.tmpM)
    })
    this.pegs.instanceMatrix.needsUpdate = true
    this.shadows.instanceMatrix.needsUpdate = true
    ;(this.shadows.material as THREE.MeshBasicMaterial).opacity = 0.16 * (1 - im) * lineOp
    this.threadMat.opacity = (1 - im) * lineOp
    this.threadMat.visible = im < 0.99 && lineOp > 0.01
    this.discs.forEach((d, k) => {
      d.quaternion.copy(this.camera.quaternion)
      const mat = d.material as THREE.MeshBasicMaterial
      const heroGate = THREE.MathUtils.smoothstep(this.heroT, 0.55, 0.95)
      mat.opacity = (k === this.discs.length - 1 ? 1 - h : heroGate) * (1 - im)
      mat.visible = mat.opacity > 0.01
    })
    // intro act
    const st = this.intro.update(this.introT, time, this.heroT < 0.7 && im < 0.01)
    const stage = this.heroT > 0.45 ? -1 : st
    if (stage !== this.introStage) {
      this.introStage = stage
      this.ev.onIntro(stage)
    }

    // the air takes on the colour of the collection you are in
    const tc = im < 0.5 && this.chapter >= 0 && h > 0.5 ? TINTS[this.chapter] : PAPER
    this.tintTarget.copy(raw(tc))
    this.tint.lerp(this.tintTarget, 1 - Math.exp(-1.6 * dt))
    this.tintColor.setRGB(this.tint.x, this.tint.y, this.tint.z, THREE.SRGBColorSpace)
    ;(this.scene.background as THREE.Color).copy(this.tintColor)
    fog.color.copy(this.tintColor)
    this.boards.forEach((b) => b.uniforms.uFogColor.value.copy(this.tint))

    const lu = (this.lint.material as THREE.ShaderMaterial).uniforms
    lu.uTime.value = time
    lu.uCam.value.copy(this.camPos)
    lu.uFog.value.copy(this.tint)

    // focus & chapter (track only)
    if (im < 0.5) {
      const { index, dist } = nearestBoard(this.sCam)
      const f = h > 0.85 && dist < W * 0.55 ? index : -1
      if (f !== this.focus) {
        this.focus = f
        this.ev.onFocus(f)
      }
      const c = h > 0.6 ? chapterAt(this.sCam) : -2
      if (c !== this.chapter) {
        this.chapter = c
        this.ev.onChapter(c)
      }
    }
    if (Math.floor(time * 4) !== Math.floor((time - dt) * 4)) this.streamHi()

    // chapter labels pinned in space
    const v = this.tmpC
    const n = this.tmpD
    chapters.forEach((_, c) => {
      const el = this.labelEls[c]
      if (!el) return
      const s = chapterS[c]
      v.copy(P(s)).addScaledVector(N(s, n), -0.12)
      v.y -= 0.45
      const d = v.distanceTo(this.camera.position)
      v.project(this.camera)
      const visible = v.z < 1 && Math.abs(v.x) < 1.6 && im < 0.95
      if (!visible) {
        el.style.opacity = '0'
        el.style.visibility = 'hidden'
        return
      }
      const x = (v.x * 0.5 + 0.5) * window.innerWidth
      const y = (-v.y * 0.5 + 0.5) * window.innerHeight
      // long titles ("Sportswear") are wider than the label box: fit the real text width
      const tw = Math.max(544, (el.firstElementChild?.children[1] as HTMLElement | undefined)?.scrollWidth ?? 544)
      const sc = Math.min(clamp(4.2 / d, 0.15, 1.6) * clamp(window.innerHeight / 900, 0.5, 1.15) * (this.camera.aspect < 1 ? 1.4 : 1), (window.innerWidth * 0.9) / tw)
      const op = (1 - THREE.MathUtils.smoothstep(d, 9, 20)) * (1 - im) * THREE.MathUtils.smoothstep(this.heroT, 0.7, 0.98)
      el.style.visibility = op > 0.01 ? 'visible' : 'hidden'
      el.style.opacity = String(op)
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${sc.toFixed(3)})`
    })

    if (this.progressEl) this.progressEl.style.setProperty('--p', this.progress.toFixed(4))

    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.disposed = true
    cancelAnimationFrame(this.raf)
    window.removeEventListener('resize', this.onResize)
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('pointermove', this.onPointerMove)
    window.removeEventListener('pointerdown', this.onPointerDown)
    window.removeEventListener('pointerup', this.onPointerUp)
    window.removeEventListener('pointercancel', this.onPointerCancel)
    window.removeEventListener('wheel', this.onWheel)
    window.removeEventListener('touchstart', this.onTouch)
    window.removeEventListener('touchmove', this.onTouch)
    window.removeEventListener('touchend', this.onTouchEnd)
    window.removeEventListener('touchcancel', this.onTouchEnd)
    this.boards.forEach((b) => {
      b.thumb?.dispose()
      b.hi?.dispose()
      ;(b.mesh.material as THREE.Material).dispose()
    })
    this.renderer.dispose()
  }
}
