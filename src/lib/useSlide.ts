import { useEffect, type RefObject } from 'react'
import { boardS, nearestBoard, scrollForS, sForProgress } from '../three/layout'

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

/**
 * Scroll and slide both walk the line.
 * - trackpad: a sideways two-finger swipe moves along the line like a vertical scroll
 * - touch / mouse: dragging the line sideways follows the finger, then settles on a board
 * Vertical scrolling stays fully native.
 */
export function useSlide(canvas: RefObject<HTMLCanvasElement>, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    const work = () => document.getElementById('work')
    const workEnd = () => {
      const w = work()
      return w ? w.offsetTop + w.offsetHeight - window.innerHeight : 0
    }
    const sAt = (y: number) => {
      const w = work()
      if (!w) return boardS[0]
      const len = Math.max(1, w.offsetHeight - window.innerHeight)
      return sForProgress(clamp((y - w.offsetTop) / len, 0, 1))
    }
    const onTrack = () => {
      const w = work()
      return !!w && window.scrollY >= w.offsetTop - 2 && window.scrollY <= workEnd() + 2
    }
    // one board per ~45% of the screen width of finger travel
    const gain = () => (scrollForS(boardS[1]) - scrollForS(boardS[0])) / (window.innerWidth * 0.45)

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
      if (window.scrollY > workEnd() + 2) return
      e.preventDefault()
      window.scrollBy(0, e.deltaX * (e.deltaMode === 1 ? 32 : 1))
    }

    type Drag = { id: number; x: number; y: number; sy: number; axis: 0 | 1 | 2; lx: number; lt: number; v: number }
    let d: Drag | null = null

    const onDown = (e: PointerEvent) => {
      if (e.target !== canvas.current || e.button > 0) return
      if (window.scrollY > workEnd() + 2) return
      const t = performance.now()
      d = { id: e.pointerId, x: e.clientX, y: e.clientY, sy: window.scrollY, axis: 0, lx: e.clientX, lt: t, v: 0 }
    }
    const onMove = (e: PointerEvent) => {
      if (!d || e.pointerId !== d.id) return
      const dx = e.clientX - d.x
      const dy = e.clientY - d.y
      if (d.axis === 0) {
        if (Math.hypot(dx, dy) < 10) return
        d.axis = Math.abs(dx) > Math.abs(dy) * 1.1 ? 1 : 2
      }
      if (d.axis !== 1) return
      const now = performance.now()
      d.v = d.v * 0.6 + ((e.clientX - d.lx) / Math.max(1, now - d.lt)) * 0.4
      d.lx = e.clientX
      d.lt = now
      window.scrollTo(0, clamp(d.sy - dx * gain(), 0, workEnd()))
    }
    const onUp = (e: PointerEvent) => {
      if (!d || e.pointerId !== d.id) return
      const s = d
      d = null
      if (s.axis !== 1 || !onTrack()) return
      let { index } = nearestBoard(sAt(window.scrollY))
      const from = nearestBoard(sAt(s.sy)).index
      // a quick flick always moves at least one board (finger left = forward)
      const dir = s.v < -0.25 ? 1 : s.v > 0.25 ? -1 : 0
      if (dir && index === from) index = clamp(index + dir, 0, boardS.length - 1)
      window.scrollTo({ top: scrollForS(boardS[index]), behavior: 'smooth' })
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [canvas, enabled])
}
