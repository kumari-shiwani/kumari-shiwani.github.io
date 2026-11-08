const STAGES = [
  {
    word: 'Discover',
    tag: 'Research · colour · yarn',
    body: 'Every collection starts with colour and yarn. This palette is real: Pantones from the men’s training range and the AMMA S/S 24 story.',
  },
  {
    word: 'Design',
    tag: 'Knit · silhouette',
    body: 'Colour becomes cloth, one row at a time: rib hem, stripes, chest band and silhouette.',
  },
  {
    word: 'Develop',
    tag: 'Tech pack · fit',
    body: 'Then it gets stitched down: flats, measurements, construction notes and every sample round.',
  },
  {
    word: 'Deliver',
    tag: 'Production · shelf',
    body: 'And then it’s out of my hands and onto the shelf. Eleven collections and eighty-two boards, hung on one red thread.',
  },
]

export default function IntroStages({ stage }: { stage: number }) {
  const on = stage >= 0
  const s = on ? STAGES[stage] : null
  return (
    <div
      className="fixed inset-0 z-10 pointer-events-none transition-opacity duration-700"
      style={{ opacity: on ? 1 : 0 }}
      aria-live="polite"
    >
      <div className="absolute left-4 right-4 bottom-6 md:left-8 md:right-8 md:bottom-10 land:right-auto land:bottom-auto land:top-1/2 land:-translate-y-1/2 land:max-w-[34rem]">
        <p className="eyebrow text-thread mb-4 md:mb-6">How a collection is made</p>
        {s && (
          <div key={stage} className="fade-swap">
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-[15px] md:text-[18px] text-muted tabular-nums">0{stage + 1}</span>
              <span className="eyebrow text-muted">{s.tag}</span>
            </div>
            <h2 className="font-serif italic text-[min(22vw,13vh)] land:text-[min(9.5vw,17vh)] leading-[0.85] tracking-[-0.03em] mt-1">
              {s.word}
            </h2>
            <p className="text-[14.5px] md:text-[16px] leading-relaxed mt-3 md:mt-6 max-w-sm text-ink/80 [@media(max-height:500px)]:hidden">{s.body}</p>
          </div>
        )}
        <ol className="flex gap-2 mt-6 md:mt-10" aria-hidden>
          {STAGES.map((x, i) => (
            <li key={x.word} className="flex-1 md:flex-none md:w-24">
              <span className="block h-[1.5px] bg-ink/15 overflow-hidden">
                <span
                  className="block h-full bg-thread origin-left transition-transform duration-700"
                  style={{ transform: `scaleX(${i <= stage ? 1 : 0})` }}
                />
              </span>
              <span className={`eyebrow !text-[9px] mt-2 block transition-colors ${i === stage ? 'text-ink' : 'text-muted/60'}`}>
                {x.word}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
