import { boards, chapters, thumbSrc } from '../lib/data'

/** Shown only when WebGL is unavailable: the same work as a plain, accessible gallery. */
export default function Fallback({ onOpen }: { onOpen: (i: number) => void }) {
  return (
    <div className="pointer-events-auto px-4 md:px-8 pt-28 pb-20" id="work">
      <h1 className="font-serif text-[18vw] md:text-[11vw] leading-[0.85]">
        Shiwani <em>Kumari</em>
      </h1>
      <p className="eyebrow text-muted mt-4">Sportswear & knitwear designer · 11 collections</p>
      {chapters.map((c, ci) => (
        <section key={c.no} className="mt-16">
          <div className="flex items-baseline gap-4 border-b border-ink/15 pb-3">
            <span className="font-mono text-thread">{c.no}</span>
            <h2 className="font-serif text-4xl md:text-5xl">{c.title}</h2>
            <span className="eyebrow text-muted">{c.kicker}</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            {boards.map((b, i) =>
              b.chapter === ci ? (
                <button key={b.page} onClick={() => onOpen(i)} className="text-left group">
                  <img src={thumbSrc(b.page)} alt={b.title} loading="lazy" className="w-full bg-white" />
                  <span className="eyebrow text-muted mt-2 block group-hover:text-thread">
                    {String(b.page).padStart(2, '0')} · {b.title}
                  </span>
                </button>
              ) : null,
            )}
          </div>
        </section>
      ))}
    </div>
  )
}
