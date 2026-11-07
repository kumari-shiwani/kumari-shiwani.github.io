import { useEffect, useRef, useState } from 'react'

/** A soft ring that follows the pointer and names the action over a board. Mouse only. */
export default function Cursor({ hover, indexMode }: { hover: number | null; indexMode: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [fine, setFine] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    setFine(mq.matches)
    if (!mq.matches) return
    let x = -100,
      y = -100,
      cx = -100,
      cy = -100,
      raf = 0
    const move = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
    }
    const tick = () => {
      cx += (x - cx) * 0.2
      cy += (y - cy) * 0.2
      if (ref.current) ref.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', move)
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', move)
      cancelAnimationFrame(raf)
    }
  }, [])

  if (!fine) return null
  const active = hover !== null
  return (
    <div ref={ref} className="fixed left-0 top-0 z-[55] pointer-events-none" aria-hidden>
      <div
        className={`-translate-x-1/2 -translate-y-1/2 rounded-full grid place-items-center transition-all duration-300 ease-out ${
          active ? 'w-[76px] h-[76px] bg-thread text-card' : 'w-2 h-2 bg-thread'
        }`}
      >
        <span className={`eyebrow !text-[9.5px] transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`}>
          {indexMode ? 'Go to' : 'Open'}
        </span>
      </div>
    </div>
  )
}
