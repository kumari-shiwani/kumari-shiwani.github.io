import type { MutableRefObject } from 'react'
import { chapters } from '../lib/data'

/** Large titles that live in 3D space between collections; the engine positions them every frame. */
export default function ChapterLabels({ refs }: { refs: MutableRefObject<(HTMLDivElement | null)[]> }) {
  return (
    <div className="fixed inset-0 z-[4] pointer-events-none overflow-hidden" aria-hidden>
      {chapters.map((c, i) => (
        <div
          key={c.no}
          ref={(el) => {
            refs.current[i] = el
          }}
          className="chapter-label"
        >
          <div className="text-center w-[34rem] origin-center">
            <div className="font-mono text-[13px] tracking-[0.3em] text-thread">— {c.no} —</div>
            <div className="font-serif italic text-[150px] leading-[0.85] tracking-[-0.03em] mt-1">{c.title}</div>
            <div className="font-mono uppercase text-[12px] tracking-[0.2em] text-ink/70 mt-4">{c.kicker}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
