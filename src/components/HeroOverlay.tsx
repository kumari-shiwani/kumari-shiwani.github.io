import { useEffect, useRef } from 'react'

export default function HeroOverlay({ ready }: { ready: boolean }) {
  const play = { animationPlayState: ready ? 'running' : 'paused' } as const
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    const on = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = ref.current
        if (!el) return
        const t = Math.min(1, window.scrollY / (window.innerHeight * 0.7))
        el.style.opacity = String(1 - t)
        el.style.transform = `translate3d(0, ${-t * 60}px, 0)`
        el.style.visibility = t >= 1 ? 'hidden' : 'visible'
      })
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <div ref={ref} className="fixed inset-0 z-10 pointer-events-none flex flex-col justify-end px-4 md:px-8 pb-6 md:pb-8">
      <div className="grid md:grid-cols-12 gap-6 items-end">
        <div className="md:col-span-8">
          <p className="eyebrow text-muted mb-4 md:mb-6 overflow-hidden [@media(max-height:700px)]:hidden">
            <span className="inline-block" style={{ animation: 'rise 1s cubic-bezier(.2,.7,.1,1) 1.7s both', ...play }}>
              Portfolio ’26 — Sportswear, Knitwear & Kidswear Design
            </span>
          </p>
          <h1 className="font-serif leading-[0.82] tracking-[-0.02em] text-[23vw] md:text-[13.5vw]">
            <span className="block overflow-hidden pb-[0.06em]">
              <span className="inline-block" style={{ animation: 'rise 1.2s cubic-bezier(.2,.7,.1,1) 1.5s both', ...play }}>
                Shiwani
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.08em] md:pl-[0.9em]">
              <span className="inline-block italic" style={{ animation: 'rise 1.2s cubic-bezier(.2,.7,.1,1) 1.62s both', ...play }}>
                Kumari
              </span>
            </span>
          </h1>
        </div>

        <div
          className="md:col-span-4 md:pb-[2.2vw] flex flex-col gap-6"
          style={{ animation: 'fadeSwap 1s cubic-bezier(.2,.7,.1,1) 2s both', ...play }}
        >
          <p className="text-[15px] md:text-[16px] leading-relaxed max-w-sm">
            Four years taking garments from the first moodboard to the production floor for Puma, FCUK,
            Myntra, Levi’s, Walmart and Milou. Eleven collections, hung on a single red thread.
          </p>
          <div className="flex items-center gap-4">
            <span className="relative block w-px h-14 bg-ink/15 overflow-hidden">
              <span className="absolute inset-0 bg-thread" style={{ animation: 'drop 2.2s cubic-bezier(.7,0,.2,1) infinite' }} />
            </span>
            <span className="eyebrow">
              Scroll to walk the line
              <br />
              <span className="text-muted [@media(hover:none)]:hidden">or press I for the index</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
