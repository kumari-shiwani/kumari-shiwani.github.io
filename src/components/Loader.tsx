import { useEffect, useState } from 'react'

export default function Loader({ progress, ready }: { progress: number; ready: boolean }) {
  const [shown, setShown] = useState(0)
  const [gone, setGone] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    let raf = 0
    const tick = () => {
      setShown((s) => {
        const target = ready ? 1 : progress * 0.96
        const n = s + (target - s) * 0.08
        return Math.abs(target - n) < 0.001 ? target : n
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [progress, ready])

  useEffect(() => {
    if (ready && shown >= 0.999 && !leaving) {
      setLeaving(true)
      const t = setTimeout(() => setGone(true), 1400)
      return () => clearTimeout(t)
    }
  }, [ready, shown, leaving])

  if (gone) return null
  const pct = Math.round(shown * 100)

  return (
    <div
      className="fixed inset-0 z-[60] bg-paper flex flex-col justify-between px-6 py-6 md:px-10 md:py-8"
      style={{
        clipPath: leaving ? 'inset(0 0 100% 0)' : 'inset(0 0 0% 0)',
        transition: 'clip-path 1.1s cubic-bezier(0.76, 0, 0.24, 1) 0.25s',
      }}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading portfolio"
    >
      <div className="flex justify-between eyebrow text-muted">
        <span>Shiwani Kumari</span>
        <span>Portfolio 2026</span>
      </div>

      <div className="relative">
        <svg viewBox="0 0 1000 120" preserveAspectRatio="none" className="w-full h-24 overflow-visible">
          <path
            d="M0 30 Q 250 110 500 60 T 1000 40"
            fill="none"
            stroke="#c8302a"
            strokeWidth="1.6"
            vectorEffect="non-scaling-stroke"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset={1 - shown}
          />
        </svg>
        <p className="font-serif italic text-[13vw] md:text-[9vw] leading-[0.85] tracking-tight -mt-6">
          Threading the line
        </p>
      </div>

      <div className="flex items-end justify-between">
        <span className="eyebrow text-muted max-w-[16rem]">82 boards · 11 collections · hung on one thread</span>
        <span className="font-mono text-5xl md:text-7xl tabular-nums">{String(pct).padStart(3, '0')}</span>
      </div>
    </div>
  )
}
