import type { RefObject } from 'react'
import { boards, chapters } from '../lib/data'
import { chapterS, progressForS } from '../three/layout'

type Props = {
  show: boolean
  focus: number
  chapter: number
  progressRef: RefObject<HTMLDivElement>
  onChapter: (c: number) => void
  onOpen: () => void
  onStep: (d: number) => void
}

const pad = (n: number) => String(n).padStart(2, '0')

export default function Hud({ show, focus, chapter, progressRef, onChapter, onOpen, onStep }: Props) {
  const ch = chapter >= 0 ? chapters[chapter] : null
  const b = focus >= 0 ? boards[focus] : null

  return (
    <div
      ref={progressRef}
      className="fixed inset-0 z-20 pointer-events-none transition-opacity duration-700"
      style={{ opacity: show ? 1 : 0, visibility: show ? 'visible' : 'hidden' }}
      aria-hidden={!show}
    >
      {/* collection rail, laid flat under the header where there is no room at the side */}
      <div className="land:hidden absolute left-4 right-4 md:left-8 md:right-8 top-[4.1rem] md:top-[5.2rem] h-7">
        <div className="absolute inset-x-0 top-1/2 h-px bg-ink/15" />
        <div
          className="absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-[0.25px] bg-thread origin-left"
          style={{ transform: 'scaleX(var(--p, 0))' }}
        />
        {chapters.map((c, i) => {
          const p = Math.max(0, Math.min(1, progressForS(chapterS[i])))
          const active = chapter === i
          return (
            <button
              key={c.no}
              onClick={() => onChapter(i)}
              className="pointer-events-auto absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 grid place-items-center"
              style={{ left: `${p * 100}%` }}
              aria-label={`Go to collection ${c.no}, ${c.title}`}
            >
              <span className={`block rounded-full transition-all duration-300 ${active ? 'w-2.5 h-2.5 bg-thread' : 'w-1.5 h-1.5 bg-ink/50'}`} />
            </button>
          )
        })}
      </div>

      {/* chapter panel */}
      <div className="absolute left-4 md:left-8 top-28 md:top-auto md:bottom-8 max-w-[19rem] md:max-w-[24rem]">
        {ch && focus >= 0 && (
          <div key={chapter} className="fade-swap">
            <div className="flex items-baseline gap-3 eyebrow">
              <span className="text-thread">Collection {ch.no}</span>
              <span className="text-muted">/ 11</span>
            </div>
            <h3 className="font-serif text-[40px] md:text-[52px] leading-[0.95] mt-2">{ch.title}</h3>
            <p className="eyebrow text-muted mt-2">{ch.kicker}</p>
            <p className="hidden lg:block [@media(min-height:780px)]:block text-[13.5px] leading-relaxed mt-3 text-ink/75">{ch.description}</p>
          </div>
        )}
        {chapter === -1 && (
          <div className="fade-swap">
            <p className="eyebrow text-thread">End of the line</p>
            <h3 className="font-serif italic text-[40px] md:text-[52px] leading-[0.95] mt-2">Thank you</h3>
            <p className="text-[13.5px] leading-relaxed mt-3 text-ink/80">
              Keep scrolling for the story behind the work, or reach out.
            </p>
          </div>
        )}
      </div>

      {/* focused board caption */}
      <div className="absolute left-4 right-[6.75rem] md:left-auto md:right-48 lg:right-20 bottom-5 md:bottom-8 flex md:justify-end">
        {b && (
          <button
            key={focus}
            onClick={onOpen}
            className="fade-swap pointer-events-auto group flex items-end gap-4 text-left"
          >
            <span className="font-mono text-[40px] md:text-[56px] leading-none tabular-nums tracking-tight">
              {pad(b.page)}
            </span>
            <span className="pb-1">
              <span className="eyebrow text-muted block">
                {b.chapter >= 0 ? chapters[b.chapter].title : 'Fin'} · Board {pad(b.page)}/83
              </span>
              <span className="block text-[15px] md:text-[17px] font-medium mt-1">{b.title}</span>
              <span className="eyebrow text-thread block mt-1.5 opacity-80 group-hover:opacity-100">
                <span className="[@media(hover:none)]:hidden">Click board or press Enter</span>
                <span className="hidden [@media(hover:none)]:inline">Tap to open</span> ↗
              </span>
            </span>
          </button>
        )}
      </div>

      {/* scroll or slide: both walk the line, the arrows make the sideways option obvious */}
      <div className="absolute bottom-5 right-4 md:bottom-8 md:right-8 lg:right-auto lg:left-1/2 lg:-translate-x-1/2 flex items-center gap-2 lg:gap-4">
        <button
          onClick={() => onStep(-1)}
          disabled={focus === 0 || (focus < 0 && chapter <= 0)}
          className="pointer-events-auto w-11 h-11 rounded-full border border-ink/25 bg-card/60 backdrop-blur grid place-items-center text-[17px] hover:bg-ink hover:text-card hover:border-ink transition-colors disabled:opacity-30 disabled:pointer-events-none"
          aria-label="Previous board"
        >
          ←
        </button>
        <span className="hidden lg:block eyebrow text-muted text-center leading-relaxed whitespace-nowrap">
          Scroll <span className="text-thread">or</span>
          <br />
          <span className="[@media(hover:none)]:hidden">slide sideways</span>
          <span className="hidden [@media(hover:none)]:inline">swipe sideways</span>
        </span>
        <button
          onClick={() => onStep(1)}
          disabled={focus === boards.length - 1 || chapter === -1}
          className="pointer-events-auto w-11 h-11 rounded-full border border-ink/25 bg-card/60 backdrop-blur grid place-items-center text-[17px] hover:bg-ink hover:text-card hover:border-ink transition-colors disabled:opacity-30 disabled:pointer-events-none"
          aria-label="Next board"
        >
          →
        </button>
      </div>

      {/* progress rail */}
      <div className="hidden land:block absolute right-8 top-1/2 -translate-y-1/2 h-[56vh] w-6">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-ink/15" />
        <div
          className="absolute left-1/2 top-0 bottom-0 w-[1.5px] -translate-x-[0.25px] bg-thread origin-top"
          style={{ transform: 'scaleY(var(--p, 0))' }}
        />
        {chapters.map((c, i) => {
          const p = Math.max(0, Math.min(1, progressForS(chapterS[i])))
          const active = chapter === i
          return (
            <button
              key={c.no}
              onClick={() => onChapter(i)}
              className="pointer-events-auto group absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 grid place-items-center"
              style={{ top: `${p * 100}%` }}
              aria-label={`Go to collection ${c.no}, ${c.title}`}
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  active ? 'w-2.5 h-2.5 bg-thread' : 'w-1.5 h-1.5 bg-ink/50 group-hover:bg-ink'
                }`}
              />
              <span
                className={`absolute right-7 whitespace-nowrap eyebrow transition-all duration-300 ${
                  active ? 'opacity-100 text-thread' : 'opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0'
                }`}
              >
                {c.no} {c.title}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
