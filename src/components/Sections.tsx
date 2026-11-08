import { useEffect, useRef } from 'react'
import { brands, capabilities, contact, experience, process, stats, tools } from '../lib/data'

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const items = el.querySelectorAll<HTMLElement>('[data-reveal]')
    items.forEach((n) => {
      n.style.opacity = '0'
      n.style.transform = 'translateY(28px)'
      n.style.transition = 'opacity 1s cubic-bezier(.2,.7,.1,1), transform 1s cubic-bezier(.2,.7,.1,1)'
    })
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (!en.isIntersecting) return
          const n = en.target as HTMLElement
          n.style.opacity = '1'
          n.style.transform = 'none'
          io.unobserve(n)
        }),
      { rootMargin: '0px 0px -12% 0px' },
    )
    items.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])
  return ref
}

/** torn paper edge, like the boards in the portfolio */
function TornEdge() {
  const pts: string[] = []
  let seed = 7
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  for (let x = 0; x <= 100; x += 0.6 + rnd() * 1.1) pts.push(`${x.toFixed(2)},${(4 + rnd() * 9).toFixed(2)}`)
  pts.push('100,6', '100,20', '0,20')
  return (
    <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="block w-full h-6 md:h-9 -mb-px" aria-hidden>
      <polygon points={pts.join(' ')} fill="#f4f0e8" />
    </svg>
  )
}

export default function Sections() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} className="relative pointer-events-auto">
      <TornEdge />
      <div className="bg-card">
        {/* ── about ── */}
        <section id="about" className="px-4 md:px-8 pt-20 md:pt-32 pb-20 md:pb-28">
          <div className="grid md:grid-cols-12 gap-y-10 gap-x-8">
            <p data-reveal className="md:col-span-3 eyebrow text-thread">
              About — the hand behind the line
            </p>
            <div className="md:col-span-9">
              <h2 data-reveal className="font-serif text-[11vw] md:text-[6.4vw] leading-[0.92] tracking-[-0.02em]">
                From the first moodboard <em className="text-thread">to</em> the production floor.
              </h2>
              <div className="grid md:grid-cols-2 gap-8 mt-10 md:mt-14 max-w-4xl">
                <p data-reveal className="text-[16px] md:text-[17px] leading-relaxed">
                  I’m an apparel designer with four years in knitwear, sportswear and lifestyle collections across
                  kidswear, womenswear and menswear. I research the trend, draw the range, then stay with it through
                  tech packs, sampling, fit reviews and vendors until it ships on time.
                </p>
                <p data-reveal className="text-[16px] md:text-[17px] leading-relaxed text-ink/75">
                  Today I lead design and development at MyTUK. Before that I owned kidswear for Milou Swish at
                  Underlinen and designed for FC, FCUK, Myntra and Puma. I work in Illustrator, Photoshop and
                  InDesign, and I care about the fabric as much as the flat, down to loop length and gauge.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 border-t border-ink/15">
            {stats.map((s) => (
              <div
                data-reveal
                key={s.label}
                className="pt-6 pb-2 pr-4 border-ink/15 [&:not(:last-child)]:md:border-r md:pl-6 first:md:pl-0"
              >
                <div className="font-serif text-[64px] md:text-[96px] leading-none">{s.metric}</div>
                <div className="eyebrow text-muted mt-3 max-w-[12rem]">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── method ── */}
        <section id="method" className="px-4 md:px-8 py-20 md:py-28 border-t border-ink/15">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-12 md:mb-16">
            <h2 data-reveal className="font-serif text-6xl md:text-8xl leading-none">
              Method
            </h2>
            <p data-reveal className="eyebrow text-muted max-w-xs">
              Spec sheet · four stages every garment passes through
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 border-t-[1.5px] border-ink">
            {process.map((p, i) => (
              <article
                data-reveal
                key={p.no}
                className="group relative pt-6 pb-10 sm:pr-6 lg:pr-8 lg:pl-6 lg:first:pl-0 border-b lg:border-b-0 border-ink/15 lg:[&:not(:last-child)]:border-r"
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <div className="flex items-center justify-between eyebrow">
                  <span className="text-thread">Stage {p.no}</span>
                  <span className="text-muted">{['Research', 'Concept', 'Tech pack', 'Production'][i]}</span>
                </div>
                <h3 className="font-serif italic text-5xl xl:text-6xl mt-6 md:mt-8">{p.title}</h3>
                <p className="text-[15px] leading-relaxed text-ink/75 mt-4 max-w-xs">{p.body}</p>
                <div className="stitch text-thread absolute left-0 right-8 bottom-4 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-700" />
              </article>
            ))}
          </div>
        </section>

        {/* ── capabilities ── */}
        <section id="capabilities" className="px-4 md:px-8 py-20 md:py-28 bg-paper">
          <div className="grid md:grid-cols-12 gap-10">
            <div className="md:col-span-4">
              <h2 data-reveal className="font-serif text-6xl md:text-7xl leading-[0.95]">
                Woven <em>in</em>
              </h2>
              <p data-reveal className="text-[15px] leading-relaxed text-ink/75 mt-6 max-w-sm">
                Skills stitched like care labels, the small things that hold a garment together.
              </p>
              <div data-reveal className="mt-10">
                <p className="eyebrow text-muted mb-3">Tools</p>
                <p className="font-serif text-2xl md:text-3xl leading-snug">{tools.join(' · ')}</p>
              </div>
            </div>
            <ul className="md:col-span-8 flex flex-wrap gap-3 md:gap-4 content-start">
              {capabilities.map((c, i) => (
                <li
                  data-reveal
                  key={c}
                  className="woven"
                  style={{ transitionDelay: `${(i % 6) * 60}ms`, rotate: `${((i * 37) % 7) - 3}deg` }}
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── experience ── */}
        <section id="experience" className="px-4 md:px-8 py-20 md:py-28">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-10 md:mb-14">
            <h2 data-reveal className="font-serif text-6xl md:text-8xl leading-none">
              Experience
            </h2>
            <a data-reveal href={contact.cv} download className="eyebrow link-thread pb-1">
              Download full CV ↓
            </a>
          </div>
          <div className="border-t-[1.5px] border-ink">
            {experience.map((x) => (
              <article
                data-reveal
                key={x.org}
                className="group relative grid md:grid-cols-12 gap-y-3 gap-x-8 py-8 md:py-10 border-b border-ink/15"
              >
                <p className="md:col-span-3 eyebrow text-muted pt-2">{x.period}</p>
                <div className="md:col-span-4">
                  <h3 className="font-serif text-4xl md:text-5xl leading-none">{x.org}</h3>
                  <p className="eyebrow text-thread mt-3">{x.title}</p>
                </div>
                <p className="md:col-span-5 text-[15px] leading-relaxed text-ink/75">{x.body}</p>
                <span className="absolute left-0 bottom-[-1px] h-[1.5px] w-full bg-thread scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-700" />
              </article>
            ))}
          </div>
        </section>

        {/* ── brands ── */}
        <section className="py-12 md:py-16 border-y border-ink/15 overflow-hidden" aria-label="Brands worked with">
          <div className="marquee-track flex items-center gap-10 md:gap-16 whitespace-nowrap">
            {[...brands, ...brands].map((b, i) => (
              <span key={i} className="flex items-center gap-10 md:gap-16">
                <span className={`font-serif text-5xl md:text-8xl ${i % 2 ? 'italic' : ''}`}>{b}</span>
                <span className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-sun" aria-hidden />
              </span>
            ))}
          </div>
        </section>

        {/* ── contact ── */}
        <section id="contact" className="relative px-4 md:px-8 pt-24 md:pt-36 pb-10 overflow-hidden">
          <div
            className="absolute -right-[18vw] -top-[10vw] w-[60vw] h-[60vw] rounded-full bg-sun/70 pointer-events-none"
            aria-hidden
          />
          <div className="relative">
            <p data-reveal className="eyebrow text-thread">Contact — open to new collections</p>
            <h2 data-reveal className="font-serif text-[14vw] md:text-[9vw] leading-[0.86] tracking-[-0.025em] mt-6">
              Let’s design
              <br />
              <em>the next season.</em>
            </h2>
            <a
              data-reveal
              href={`mailto:${contact.email}`}
              className="inline-block mt-10 md:mt-14 text-[6vw] md:text-[3.4vw] font-sans font-medium tracking-tight link-thread pb-1 break-all"
            >
              {contact.email}
            </a>

            <div data-reveal className="mt-14 md:mt-20 grid sm:grid-cols-2 md:grid-cols-4 gap-6 border-t border-ink/15 pt-8">
              <div>
                <p className="eyebrow text-muted mb-2">Phone</p>
                <a href={`tel:${contact.phoneHref}`} className="link-thread text-[15px]">
                  {contact.phone}
                </a>
              </div>
              <div>
                <p className="eyebrow text-muted mb-2">LinkedIn</p>
                <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="link-thread text-[15px]">
                  in/shiwanikumari3 ↗
                </a>
              </div>
              <div>
                <p className="eyebrow text-muted mb-2">Curriculum vitae</p>
                <a href={contact.cv} download className="link-thread text-[15px]">
                  Shiwani_CV.pdf ↓
                </a>
              </div>
              <div>
                <p className="eyebrow text-muted mb-2">Full portfolio</p>
                <a href={contact.portfolioPdf} target="_blank" rel="noopener" className="link-thread text-[15px]">
                  Portfolio PDF, 83 boards ↗
                </a>
              </div>
            </div>
          </div>

          <footer className="relative mt-24 md:mt-32 flex flex-wrap items-center justify-between gap-4 eyebrow text-muted">
            <span>© {new Date().getFullYear()} Shiwani Kumari</span>
            <span className="flex items-center gap-3">
              <span className="inline-block w-10 h-[1.5px] bg-thread" /> Everything hangs on one thread
            </span>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="link-thread">
              Back to the start ↑
            </button>
          </footer>
        </section>
      </div>
    </div>
  )
}
