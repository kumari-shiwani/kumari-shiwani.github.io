import { useEffect, useState } from 'react'
import { chapters } from '../lib/data'

const COLS = 14
const ROWS = 12
const SW = 22
const RS = 15

// same yarns as the knitted tee in the intro act
const YARNS = [
  { hex: '#1f2b4f', name: 'Midnight' },
  { hex: '#ece5d6', name: 'Chalk' },
  { hex: '#7ba3dc', name: 'Cornflower' },
  { hex: '#d8393e', name: 'Radiant Red' },
  { hex: '#ef5a30', name: 'Flame' },
  { hex: '#d9a3c9', name: 'Fondant Pink' },
  { hex: '#9ec796', name: 'Green Fig' },
  { hex: '#c3d465', name: 'Wild Lime' },
]

const rowColor = (r: number) => {
  if (r < 2) return '#1f2b4f'
  if (r === 4) return '#d8393e'
  if (r >= 7 && r <= 9) return r === 8 ? '#ece5d6' : '#7ba3dc'
  if (r >= 10) return '#1f2b4f'
  return '#d9cfbd'
}

// stitch order: from the hem up, alternating direction like a flatbed carriage
const STITCHES = Array.from({ length: ROWS }, (_, r) =>
  Array.from({ length: COLS }, (_, c) => ({ r, c: r % 2 ? COLS - 1 - c : c })),
).flat()

function Swatch({ shown }: { shown: number }) {
  const done = shown * STITCHES.length
  const H = ROWS * RS + 12
  return (
    <svg viewBox={`-4 -4 ${COLS * SW + 8} ${H + 8}`} className="w-full h-auto overflow-visible" aria-hidden>
      {STITCHES.map(({ r, c }, i) => {
        const k = Math.min(1, Math.max(0, done - i))
        const x = c * SW
        const y = H - (r + 1) * RS - 6
        return (
          <path
            key={i}
            d={`M${x + 2} ${y} Q${x + 5} ${y + 12} ${x + SW / 2} ${y + 19} Q${x + SW - 5} ${y + 12} ${x + SW - 2} ${y}`}
            fill="none"
            stroke={rowColor(r)}
            strokeWidth={5.2}
            strokeLinecap="round"
            style={{
              opacity: k,
              transform: `translateY(${(1 - k) * -8}px)`,
              transition: 'opacity .25s, transform .35s cubic-bezier(.2,.7,.1,1)',
            }}
          />
        )
      })}
    </svg>
  )
}

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
  const current = Math.min(chapters.length - 1, Math.floor(shown * chapters.length))

  return (
    <div
      className="fixed inset-0 z-[60] bg-paper overflow-hidden flex flex-col justify-between px-5 py-5 md:px-10 md:py-8"
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
      {/* the sun from the portfolio's divider pages */}
      <div
        className="absolute rounded-full bg-sun pointer-events-none w-[78vw] h-[78vw] -right-[30vw] top-[6vh] md:w-[44vw] md:h-[44vw] md:right-[-6vw] md:top-1/2 md:-translate-y-1/2"
        style={{ scale: String(0.92 + shown * 0.08), transition: 'scale .4s' }}
        aria-hidden
      />

      {/* the red thread, drawn across and down into the swatch */}
      <svg
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
        aria-hidden
      >
        <path
          d="M-20 140 C 220 60, 420 260, 600 170 S 760 120, 790 250"
          fill="none"
          stroke="#c8302a"
          strokeWidth="1.6"
          vectorEffect="non-scaling-stroke"
          pathLength={1}
          strokeDasharray="1 2"
          strokeDashoffset={1 - Math.min(1, shown * 1.6)}
        />
      </svg>

      <div className="relative flex justify-between eyebrow text-muted">
        <span>
          Shiwani Kumari<span className="hidden sm:inline"> — Sportswear & Knitwear</span>
        </span>
        <span>Portfolio 2026</span>
      </div>

      <div className="relative grid md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-7 order-2 md:order-1">
          <p className="eyebrow text-thread mb-4">Casting on</p>
          <p className="font-serif text-[15vw] md:text-[8.4vw] leading-[0.84] tracking-[-0.02em]">
            Threading
            <br />
            <em>the line</em>
          </p>
          <ul className="mt-8 md:mt-10 flex flex-wrap gap-x-5 gap-y-3 max-w-xl" aria-hidden>
            {YARNS.map((y, i) => (
              <li
                key={y.name}
                className="flex items-center gap-2 transition-opacity duration-500"
                style={{ opacity: shown * YARNS.length > i ? 1 : 0.25 }}
              >
                <span className="w-3.5 h-3.5 rounded-full" style={{ background: y.hex, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.08)' }} />
                <span className="eyebrow text-muted !text-[9.5px]">{y.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-5 order-1 md:order-2 flex justify-center">
          <div className="relative w-[62vw] md:w-[26vw] max-w-[380px]">
            <span className="absolute -top-7 left-0 eyebrow text-ink/60 !text-[9.5px] whitespace-nowrap">
              Swatch SSJ-01<span className="hidden md:inline"> · single jersey · {COLS} × {ROWS}</span>
            </span>
            {/* phones: the red thread runs in from the left edge and drops onto the swatch */}
            <svg
              viewBox="0 0 300 100"
              preserveAspectRatio="none"
              className="md:hidden [@media(max-height:700px)]:hidden absolute right-[18%] bottom-full translate-y-6 w-[78vw] h-24 overflow-visible pointer-events-none"
              aria-hidden
            >
              <path
                d="M0 25 C 75 0, 135 75, 210 45 S 297 20, 300 100"
                fill="none"
                stroke="#c8302a"
                strokeWidth="1.6"
                pathLength={1}
                strokeDasharray="1 2"
                strokeDashoffset={1 - Math.min(1, shown * 1.6)}
              />
            </svg>
            <Swatch shown={shown} />
            <span className="absolute -bottom-7 right-0 eyebrow text-ink/60 !text-[9.5px] tabular-nums">
              Row {String(Math.min(ROWS, Math.floor(shown * ROWS) + 1)).padStart(2, '0')} / {ROWS}
            </span>
          </div>
        </div>
      </div>

      <div className="relative flex items-end justify-between gap-6">
        <div className="min-w-0">
          <p className="eyebrow text-muted mb-2">Hanging collection</p>
          <p key={current} className="fade-swap font-serif text-2xl md:text-3xl whitespace-nowrap">
            <span className="font-mono text-thread text-base md:text-lg mr-3">{chapters[current].no}</span>
            {chapters[current].title}
            <span className="block md:inline eyebrow text-muted md:ml-4 mt-1 md:mt-0 !text-[9.5px] md:!text-[inherit]">{chapters[current].kicker}</span>
          </p>
          <div className="flex gap-1 md:gap-1.5 mt-4 w-[52vw] md:w-auto" aria-hidden>
            {chapters.map((c, i) => (
              <span
                key={c.no}
                className="h-[3px] flex-1 md:flex-none md:w-8 transition-colors duration-500"
                style={{ background: i <= current ? '#c8302a' : 'rgba(23,21,18,.14)' }}
              />
            ))}
          </div>
        </div>
        <span className="font-mono text-5xl md:text-7xl tabular-nums leading-none">{String(pct).padStart(3, '0')}</span>
      </div>
    </div>
  )
}
