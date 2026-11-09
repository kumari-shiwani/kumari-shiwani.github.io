import { useCallback, useEffect, useRef, useState } from 'react'
import { boards, chapters, contact, fullSrc, thumbSrc } from '../lib/data'

type Props = { index: number | null; onClose: () => void; onNavigate: (i: number) => void }

type View = { s: number; x: number; y: number }
const ID: View = { s: 1, x: 0, y: 0 }

export default function Lightbox({ index, onClose, onNavigate }: Props) {
  const [view, setView] = useState<View>(ID)
  const [loaded, setLoaded] = useState<number | null>(null)
  const [visible, setVisible] = useState(false)
  const stage = useRef<HTMLDivElement>(null)
  const frame = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; y: number; vx: number; vy: number } | null>(null)
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const pinch = useRef<{ d: number; s: number } | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const lastFocus = useRef<Element | null>(null)

  const open = index !== null
  const b = open ? boards[index] : null

  useEffect(() => {
    if (open) {
      lastFocus.current = document.activeElement
      requestAnimationFrame(() => setVisible(true))
      closeRef.current?.focus({ preventScroll: true })
    } else {
      setVisible(false)
      ;(lastFocus.current as HTMLElement | null)?.focus?.({ preventScroll: true })
    }
  }, [open])

  /** keep the board on screen while panning */
  const bound = useCallback((v: View): View => {
    const st = stage.current
    const fr = frame.current
    if (!st || !fr || v.s <= 1.001) return ID
    const mx = Math.max(0, (fr.offsetWidth * v.s - st.clientWidth) / 2 + 12)
    const my = Math.max(0, (fr.offsetHeight * v.s - st.clientHeight) / 2 + 12)
    return { s: v.s, x: Math.min(mx, Math.max(-mx, v.x)), y: Math.min(my, Math.max(-my, v.y)) }
  }, [])

  /** on portrait phones a wide board opens tall enough to read, starting at its left edge */
  const fit = useCallback((): View => {
    const st = stage.current
    const fr = frame.current
    if (!st || !fr) return ID
    if (st.clientHeight < st.clientWidth * 0.9) return ID
    const s = Math.min(4, (st.clientHeight * 0.7) / fr.offsetHeight)
    if (s <= 1.05) return ID
    return bound({ s, x: 1e6, y: 0 })
  }, [bound])

  useEffect(() => {
    setView(ID)
    if (index === null) return
    const r = requestAnimationFrame(() => setView(fit()))
    const onResize = () => setView(fit())
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(r)
      window.removeEventListener('resize', onResize)
    }
  }, [index, fit])

  const step = useCallback(
    (d: number) => {
      if (index === null) return
      onNavigate((index + d + boards.length) % boards.length)
    },
    [index, onNavigate],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
      if (e.key === '+' || e.key === '=') setView((v) => bound({ ...v, s: Math.min(10, v.s * 1.4) }))
      if (e.key === '-') setView((v) => (v.s / 1.4 <= 1.02 ? ID : { ...v, s: v.s / 1.4 }))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, step])

  const zoomAt = (cx: number, cy: number, factor: number) => {
    const el = stage.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = cx - r.left - r.width / 2
    const py = cy - r.top - r.height / 2
    setView((v) => {
      const s = Math.min(10, Math.max(1, v.s * factor))
      if (s === 1) return ID
      const k = s / v.s
      return bound({ s, x: px - (px - v.x) * k, y: py - (py - v.y) * k })
    })
  }

  /** the visible + / − buttons zoom about the middle of the screen */
  const zoomBy = (factor: number) => {
    const el = stage.current
    if (!el) return
    const r = el.getBoundingClientRect()
    zoomAt(r.left + r.width / 2, r.top + r.height / 2, factor)
  }

  const onWheel = (e: React.WheelEvent) => {
    zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.0022))
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('[data-zoom]')) return
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointers.current.size === 2) {
      const [a, c] = [...pointers.current.values()]
      pinch.current = { d: Math.hypot(a.x - c.x, a.y - c.y), s: view.s }
      drag.current = null
    } else {
      drag.current = { x: e.clientX, y: e.clientY, vx: e.clientX, vy: e.clientY }
    }
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pinch.current && pointers.current.size === 2) {
      const [a, c] = [...pointers.current.values()]
      const d = Math.hypot(a.x - c.x, a.y - c.y)
      const target = Math.min(10, Math.max(1, (pinch.current.s * d) / pinch.current.d))
      zoomAt((a.x + c.x) / 2, (a.y + c.y) / 2, target / view.s)
      return
    }
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.x
    const dy = e.clientY - d.y
    d.x = e.clientX
    d.y = e.clientY
    if (view.s > 1) setView((v) => bound({ ...v, x: v.x + dx, y: v.y + dy }))
  }
  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId)
    if (pointers.current.size < 2) pinch.current = null
    const d = drag.current
    drag.current = null
    if (!d) return
    const dx = e.clientX - d.vx
    const sideways = Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(e.clientY - d.vy)
    if (!sideways) return
    if (view.s === 1) return step(dx < 0 ? 1 : -1)
    // dragging past either end of a zoomed board moves to the next one
    const edge = bound({ ...view, x: 1e6 }).x
    if (dx > 0 && view.x >= edge - 1) step(-1)
    else if (dx < 0 && view.x <= -edge + 1) step(1)
  }

  if (!open || !b) return null
  const ch = b.chapter >= 0 ? chapters[b.chapter] : null

  return (
    <div
      className="fixed inset-0 z-[58] bg-[#12110f] text-card flex flex-col transition-opacity duration-500"
      style={{ opacity: visible ? 1 : 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={`Board ${b.page}: ${b.title}`}
    >
      <div className="flex items-center justify-between px-4 md:px-8 py-4 md:py-5">
        <div className="flex items-baseline gap-4 min-w-0">
          <span className="font-mono text-2xl md:text-3xl tabular-nums">{String(b.page).padStart(2, '0')}</span>
          <div className="min-w-0">
            <p className="eyebrow text-card/50 truncate">{ch ? `Collection ${ch.no} · ${ch.title} · ${ch.kicker}` : 'Fin'}</p>
            <p className="text-[15px] md:text-[17px] truncate">{b.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <span className="hidden lg:inline [@media(hover:none)]:!hidden eyebrow text-card/40 mr-2">Scroll or pinch to zoom · drag to pan</span>
          <a
            href={fullSrc(b.page)}
            target="_blank"
            rel="noopener"
            className="inline-flex eyebrow rounded-full border border-card/25 px-3 md:px-3.5 py-2 hover:bg-card hover:text-ink transition-colors whitespace-nowrap"
          >
            Full size ↗
          </a>
          <button
            ref={closeRef}
            onClick={onClose}
            className="eyebrow rounded-full bg-card text-ink px-4 py-2 hover:bg-thread hover:text-card transition-colors"
          >
            Close ✕
          </button>
        </div>
      </div>

      <div
        ref={stage}
        className="relative flex-1 overflow-hidden touch-none select-none"
        style={{ cursor: view.s > 1 ? 'grab' : 'zoom-in' }}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={(e) => {
          const f = fit()
          if (view.s > 1 && Math.abs(view.s - f.s) > 0.01) setView(f)
          else if (view.s > 1) setView(ID)
          else zoomAt(e.clientX, e.clientY, 2.5)
        }}
      >
        <div
          className="absolute inset-0 grid place-items-center px-2 md:px-16"
          style={{
            transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.s})`,
            transition: drag.current || pinch.current ? 'none' : 'transform 0.35s cubic-bezier(.2,.7,.1,1)',
          }}
        >
          <div ref={frame} className="relative w-full max-h-full" style={{ aspectRatio: '7016 / 2482', maxWidth: 'min(100%, calc((100vh - 170px) * 2.8267))' }}>
            <img
              src={thumbSrc(b.page)}
              alt=""
              className="absolute inset-0 w-full h-full object-contain blur-[2px]"
              draggable={false}
            />
            <img
              key={b.page}
              src={fullSrc(b.page)}
              alt={`${b.title}, board ${b.page} of Shiwani Kumari's portfolio`}
              onLoad={() => setLoaded(b.page)}
              className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]"
              style={{ opacity: loaded === b.page ? 1 : 0 }}
              draggable={false}
            />
          </div>
        </div>

        {/* zoom controls, on every device */}
        <div
          data-zoom
          className="absolute bottom-3 md:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-[#12110f]/80 backdrop-blur border border-card/20 p-1 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]"
          onDoubleClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => zoomBy(1 / 1.5)}
            disabled={view.s <= 1}
            className="w-10 h-10 rounded-full grid place-items-center text-xl leading-none hover:bg-card hover:text-ink transition-colors disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Zoom out"
          >
            −
          </button>
          <button
            onClick={() => setView(ID)}
            className="min-w-[4.25rem] h-10 rounded-full px-2 font-mono text-[12px] tabular-nums hover:bg-card hover:text-ink transition-colors"
            aria-label="Reset zoom"
            title="Reset zoom"
          >
            {Math.round(view.s * 100)}%
          </button>
          <button
            onClick={() => zoomBy(1.5)}
            disabled={view.s >= 9.99}
            className="w-10 h-10 rounded-full grid place-items-center text-xl leading-none hover:bg-card hover:text-ink transition-colors disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Zoom in"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 md:px-8 py-4 md:py-5">
        <button onClick={() => step(-1)} className="eyebrow hover:text-thread transition-colors py-3 pr-3">
          ← Prev
        </button>
        <div className="flex-1 mx-6 md:mx-12 relative h-px bg-card/15">
          <div
            className="absolute left-0 top-0 h-[1.5px] bg-thread transition-all duration-500"
            style={{ width: `${((index + 1) / boards.length) * 100}%` }}
          />
          <span className="hidden [@media(hover:none)]:block absolute left-1/2 -translate-x-1/2 -top-6 eyebrow !text-[9px] text-card/45 whitespace-nowrap">
            Drag to read · pinch to zoom
          </span>
          <a
            href={contact.portfolioPdf}
            target="_blank"
            rel="noopener"
            className="absolute left-1/2 -translate-x-1/2 top-3 eyebrow text-card/40 hover:text-card whitespace-nowrap max-md:!text-[9px]"
          >
            <span className="md:hidden">Portfolio PDF ↓</span>
            <span className="hidden md:inline">Download full portfolio PDF</span>
          </a>
        </div>
        <button onClick={() => step(1)} className="eyebrow hover:text-thread transition-colors py-3 pl-3">
          Next →
        </button>
      </div>
    </div>
  )
}
