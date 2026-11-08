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
}

const pad = (n: number) => String(n).padStart(2, '0')

export default function Hud({ show, focus, chapter, progressRef, onChapter, onOpen }: Props) {
  const ch = chapter >= 0 ? chapters[chapter] : null
  const b = focus >= 0 ? boards[focus] : null

  return (
    <div
      className="fixed inset-0 z-20 pointer-events-none transition-opacity duration-700"
      style={{ opacity: show ? 1 : 0, visibility: show ? 'visible' : 'hidden' }}
      aria-hidden={!show}
    >
      {/* chapter panel */}
      <div className="absolute left-4 md:left-8 top-20 md:top-auto md:bottom-8 max-w-[19rem] md:max-w-[24rem]">
        {ch && focus >= 0 && (
          <div key={chapter} className="fade-swap">
            <div className="flex items-baseline gap-3 eyebrow">
              <span className="text-thread">Collection {ch.no}</span>
              <span className="text-muted">/ 11</span>
            </div>
            <h3 className="font-serif text-[40px] md:text-[52px] leading-[0.95] mt-2">{ch.title}</h3>
            <p className="eyebrow text-muted mt-2">{ch.kicker}</p>
            <p className="hidden lg:block text-[13.5px] leading-relaxed mt-3 text-ink/75">{ch.description}</p>
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
      <div className="absolute left-4 right-4 md:left-auto md:right-20 bottom-5 md:bottom-8 flex md:justify-end">
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

      {/* progress rail */}
      <div className="hidden md:block absolute right-8 top-1/2 -translate-y-1/2 h-[56vh] w-6">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-ink/15" />
        <div
          ref={progressRef}
          className="absolute left-1/2 top-0 bottom-0 w-[1.5px] -translate-x-[0.25px] bg-thread origin-top"
          style={{ transform: 'scaleY(0)' }}
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
