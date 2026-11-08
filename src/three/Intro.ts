import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

/**
 * The scroll-driven act between the hero and the line:
 * yarn unwinds from the sun (Discover), a tee is knitted row by row (Design),
 * a needle topstitches it (Develop), then it unravels back into yarn (Deliver).
 */

// Colours from the Performance range (board 48) and the AMMA S/S 24 palette (board 05).
const YARN = {
  midnight: '#1f2b4f',
  chalk: '#ece5d6',
  cornflower: '#7ba3dc',
  red: '#d8393e',
  flame: '#ef5a30',
  lime: '#c3d465',
  pink: '#d9a3c9',
  fig: '#9ec796',
}

// a boxy tee (local units)
const TEE: [number, number][] = [
  [-0.42, 1.45], [-1.1, 1.3], [-1.78, 0.82], [-1.42, 0.2], [-1.02, 0.45],
  [-1.02, -1.45], [1.02, -1.45], [1.02, 0.45], [1.42, 0.2], [1.78, 0.82],
  [1.1, 1.3], [0.42, 1.45], [0.26, 1.24], [0, 1.15], [-0.26, 1.24],
]

const SW = 0.115 // stitch width
const RS = 0.1 // row step (stitches overlap like real knit)

const sm = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
const clamp01 = (x: number) => Math.min(1, Math.max(0, x))

function inside(x: number, y: number) {
  let c = false
  for (let i = 0, j = TEE.length - 1; i < TEE.length; j = i++) {
    const [xi, yi] = TEE[i]
    const [xj, yj] = TEE[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}

/** one knit "V": two plump yarn legs meeting at the bottom */
function stitchGeometry() {
  const leg = (s: number) =>
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(s * 0.46 * SW, 0.62 * RS * 1.5, 0),
      new THREE.Vector3(s * 0.4 * SW, 0.18 * RS * 1.5, 0.018),
      new THREE.Vector3(s * 0.22 * SW, -0.24 * RS * 1.5, 0.022),
      new THREE.Vector3(s * 0.03 * SW, -0.55 * RS * 1.5, 0.004),
    ])
  const r = SW * 0.17
  return mergeGeometries([new THREE.TubeGeometry(leg(-1), 10, r, 6), new THREE.TubeGeometry(leg(1), 10, r, 6)])!
}

type Stitch = { x: number; y: number; color: THREE.Color; rot: number }

export class Intro {
  private group = new THREE.Group()
  private knit: THREE.InstancedMesh
  private stitches: Stitch[] = []
  private needle: THREE.Mesh
  private outline: THREE.Mesh
  private outlineMat: THREE.MeshBasicMaterial
  private curve: THREE.CatmullRomCurve3
  private outlineCount = 0
  private carrier: THREE.Line
  private carrierPts = new Float32Array(32 * 3)
  private strands: THREE.Mesh[] = []
  private strandMats: THREE.MeshStandardMaterial[] = []
  private sunPos = new THREE.Vector3()
  private scene: THREE.Scene

  private m = new THREE.Matrix4()
  private p = new THREE.Vector3()
  private v = new THREE.Vector3()
  private q = new THREE.Quaternion()
  private s = new THREE.Vector3()
  private z = new THREE.Vector3(0, 0, 1)
  private needleLocal = new THREE.Vector3(99, 99, 0)

  constructor(scene: THREE.Scene, thread: string) {
    this.scene = scene
    // rows from the hem up, alternating direction like a flatbed carriage
    let row = 0
    for (let y = -1.45 + RS / 2; y < 1.45; y += RS, row++) {
      const xs: number[] = []
      for (let x = -1.8; x <= 1.8 + 1e-6; x += SW) if (inside(x, y) && y < 1.33) xs.push(x)
      if (row % 2) xs.reverse()
      const yn = (y + 1.45) / 2.9
      for (const x of xs) {
        let c = YARN.chalk
        if (Math.abs(x) > 1.05) c = YARN.flame
        else if (row < 3) c = YARN.midnight
        else if (yn > 0.66) c = YARN.midnight
        else if (yn > 0.43) c = Math.abs(yn - 0.545) < 0.02 ? YARN.chalk : YARN.cornflower
        else if (row % 7 === 0) c = YARN.red
        this.stitches.push({ x, y, color: new THREE.Color(c), rot: (Math.random() - 0.5) * 0.14 })
      }
    }

    this.knit = new THREE.InstancedMesh(
      stitchGeometry(),
      new THREE.MeshStandardMaterial({ roughness: 0.9, metalness: 0, color: '#ffffff' }),
      this.stitches.length,
    )
    this.knit.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    this.knit.frustumCulled = false
    this.stitches.forEach((st, i) => this.knit.setColorAt(i, st.color))
    this.group.add(this.knit)

    // needle
    const shaft = new THREE.CylinderGeometry(0.013, 0.0015, 0.78, 12).translate(0, 0.39, 0)
    const eye = new THREE.TorusGeometry(0.017, 0.0045, 8, 20).translate(0, 0.79, 0)
    this.needle = new THREE.Mesh(
      mergeGeometries([shaft.toNonIndexed(), eye.toNonIndexed()])!,
      new THREE.MeshStandardMaterial({ color: '#d9dce2', metalness: 0.55, roughness: 0.28, emissive: '#3a3c40' }),
    )
    this.group.add(this.needle)

    // the red topstitch it sews
    const pts = TEE.map(([x, y]) => new THREE.Vector3(x * 0.93, y * 0.93 - 0.02, 0.11))
    this.curve = new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.08)
    const tube = new THREE.TubeGeometry(this.curve, 420, 0.012, 6, true)
    this.outlineCount = tube.index!.count
    this.outlineMat = new THREE.MeshBasicMaterial({ color: thread, transparent: true })
    this.outline = new THREE.Mesh(tube, this.outlineMat)
    this.outline.frustumCulled = false
    this.group.add(this.outline)
    scene.add(this.group)

    // the yarn feeding the carriage
    const cg = new THREE.BufferGeometry()
    cg.setAttribute('position', new THREE.BufferAttribute(this.carrierPts, 3))
    this.carrier = new THREE.Line(cg, new THREE.LineBasicMaterial({ color: '#ffffff' }))
    this.carrier.frustumCulled = false
    scene.add(this.carrier)
  }

  /** frame everything relative to the resting hero camera */
  setFrame(pos: THREE.Vector3, look: THREE.Vector3, aspect: number, sun: THREE.Vector3) {
    const fwd = look.clone().sub(pos).normalize()
    const right = new THREE.Vector3().crossVectors(fwd, new THREE.Vector3(0, 1, 0)).normalize()
    const up = new THREE.Vector3().crossVectors(right, fwd).normalize()
    this.sunPos.copy(sun)
    this.m.lookAt(pos, look, new THREE.Vector3(0, 1, 0))

    const portrait = aspect < 1
    const dist = 6.2
    const vis = 2 * dist * Math.tan(THREE.MathUtils.degToRad(18))
    const scale = 0.82 * Math.min(1, (vis * aspect * (portrait ? 0.92 : 0.46)) / 3.6, (vis * 0.66) / 2.9)
    this.group.position
      .copy(pos)
      .addScaledVector(fwd, dist)
      .addScaledVector(right, portrait ? 0 : vis * aspect * 0.19)
      .addScaledVector(up, portrait ? vis * 0.14 : -0.05)
    this.group.quaternion.setFromRotationMatrix(this.m)
    this.group.scale.setScalar(scale)
    this.group.updateMatrixWorld(true)

    // yarn strands: from the sun, curving down to the hem where knitting starts
    this.strands.forEach((s) => {
      this.scene.remove(s)
      s.geometry.dispose()
    })
    this.strandMats.forEach((m) => m.dispose())
    this.strands = []
    this.strandMats = []
    const colors = [YARN.midnight, YARN.chalk, YARN.cornflower, YARN.red, YARN.flame, YARN.pink, YARN.fig, YARN.lime]
    const hem = new THREE.Vector3(-0.9, -1.45, 0).applyMatrix4(this.group.matrixWorld)
    colors.forEach((c, i) => {
      // a parallel bundle, like yarn running off a row of cones
      const k = i - (colors.length - 1) / 2
      const a = Math.PI * 1.22 + k * 0.07
      const start = sun.clone().add(new THREE.Vector3(Math.cos(a) * 3.6, Math.sin(a) * 3.6, 0))
      const mid1 = start
        .clone()
        .lerp(hem, 0.4)
        .addScaledVector(up, 2.2 + k * 0.12)
        .addScaledVector(right, (-2.6 + k * 0.16) * (portrait ? 0.25 : 1))
      const mid2 = start
        .clone()
        .lerp(hem, 0.82)
        .addScaledVector(up, 0.5 + k * 0.05)
        .addScaledVector(right, (-0.9 + k * 0.06) * (portrait ? 0.35 : 1))
      const end = hem.clone().addScaledVector(right, (i * 0.16 + 0.1) * scale)
      const curve = new THREE.CatmullRomCurve3([start, mid1, mid2, end])
      const mat = new THREE.MeshStandardMaterial({ color: c, roughness: 0.85, transparent: true, fog: false })
      const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 160, 0.022, 6), mat)
      mesh.frustumCulled = false
      mesh.userData.count = mesh.geometry.index!.count
      mesh.visible = false
      this.scene.add(mesh)
      this.strands.push(mesh)
      this.strandMats.push(mat)
    })
  }

  /** how much the line of boards should step aside while the act plays */
  lineHide(t: number) {
    return sm(0.02, 0.1, t) * (1 - sm(0.9, 0.99, t))
  }

  /** t: 0..1 through the act. Returns the active stage (0..3) or -1. */
  update(t: number, time: number, visible: boolean): number {
    const show = visible && t > 0.005 && t < 0.999
    this.group.visible = show
    this.carrier.visible = false
    this.strands.forEach((s) => (s.visible = false))
    if (!show) return t >= 0.999 ? 3 : -1

    // 1 — yarn unwinds from the sun
    const draw = sm(0.04, 0.26, t)
    const strandFade = 1 - sm(0.27, 0.35, t)
    this.strands.forEach((s, i) => {
      const k = clamp01(draw * 1.2 - i * 0.025)
      s.geometry.setDrawRange(0, Math.floor((k * s.userData.count) / 6) * 6)
      this.strandMats[i].opacity = strandFade
      s.visible = k > 0 && strandFade > 0.01
    })

    // 2 — knit row by row; 4 — unravel from the top
    const N = this.stitches.length
    const knitted = clamp01((t - 0.24) / 0.31) * (N + 10)
    const left = (1 - sm(0.8, 0.97, t)) * (N + 10)
    const stitchT = sm(0.58, 0.8, t)

    // 3 — the needle
    const needleOn = sm(0.55, 0.6, t) * (1 - sm(0.8, 0.85, t))
    this.needle.visible = needleOn > 0.01
    if (this.needle.visible) {
      const u = Math.min(stitchT, 0.9999)
      this.curve.getPointAt(u, this.needleLocal)
      const tan = this.curve.getTangentAt(u, this.v)
      this.needleLocal.z = 0.12 + Math.abs(Math.sin(stitchT * 140)) * 0.12
      this.needle.position.copy(this.needleLocal)
      this.needle.quaternion.setFromUnitVectors(this.s.set(0, 1, 0), this.p.set(-tan.x, -tan.y, 0.9).normalize())
      this.needle.scale.setScalar(needleOn)
    } else this.needleLocal.set(99, 99, 0)
    this.outline.geometry.setDrawRange(0, Math.floor((stitchT * this.outlineCount) / 6) * 6)
    this.outlineMat.opacity = 1 - sm(0.8, 0.9, t)
    this.outline.visible = stitchT > 0.001

    let head = -1
    for (let i = 0; i < N; i++) {
      const st = this.stitches[i]
      const born = clamp01((knitted - i) / 10)
      const alive = clamp01((left - i) / 10)
      const k = Math.min(born, alive)
      if (k <= 0) {
        this.m.makeScale(0, 0, 0)
        this.knit.setMatrixAt(i, this.m)
        continue
      }
      if (born < 1 || alive < 1) head = i
      const pop = 1 - (1 - k) * (1 - k)
      const dx = st.x - this.needleLocal.x
      const dy = st.y - this.needleLocal.y
      const bump = Math.exp(-(dx * dx + dy * dy) * 10) * 0.14
      const breathe = Math.sin(st.x * 2.1 + time * 1.5) * 0.04 + Math.sin(st.y * 2.6 - time) * 0.025
      this.p.set(st.x, st.y + (1 - pop) * 0.18, breathe + bump + (1 - pop) * 0.3)
      this.q.setFromAxisAngle(this.z, st.rot + (1 - pop) * 0.6)
      this.s.setScalar(0.25 + pop * 0.75)
      this.m.compose(this.p, this.q, this.s)
      this.knit.setMatrixAt(i, this.m)
    }
    this.knit.instanceMatrix.needsUpdate = true

    // the yarn running from the carriage back up to the sun
    if (head >= 0) {
      const st = this.stitches[head]
      const a = this.v.set(st.x, st.y, 0.05).applyMatrix4(this.group.matrixWorld)
      const b = this.sunPos
      for (let j = 0; j < 32; j++) {
        const u = j / 31
        const sag = Math.sin(u * Math.PI) * 1.6
        this.carrierPts[j * 3] = a.x + (b.x - a.x) * u
        this.carrierPts[j * 3 + 1] = a.y + (b.y - a.y) * u - sag
        this.carrierPts[j * 3 + 2] = a.z + (b.z - a.z) * u
      }
      this.carrier.geometry.attributes.position.needsUpdate = true
      ;(this.carrier.material as THREE.LineBasicMaterial).color.copy(st.color)
      this.carrier.visible = true
    }

    if (t < 0.04) return -1
    if (t < 0.26) return 0
    if (t < 0.57) return 1
    if (t < 0.8) return 2
    return 3
  }
}
