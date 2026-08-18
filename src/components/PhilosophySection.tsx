import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { fullSrc } from '../lib/data'

export default function PhilosophySection() {
  const headingRef = useRef(null)
  const leftRef = useRef(null)
  const rightRef = useRef(null)
  const headingInView = useInView(headingRef, { once: true, margin: '-100px' })
  const leftInView = useInView(leftRef, { once: true, margin: '-100px' })
  const rightInView = useInView(rightRef, { once: true, margin: '-100px' })

  return (
    <section className="bg-black py-28 md:py-40 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          ref={headingRef}
          initial={{ opacity: 0, y: 40 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl lg:text-8xl text-white tracking-tight mb-16 md:mb-24"
        >
          Design{' '}
          <em
            className="italic text-white/40"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            x
          </em>{' '}
          Delivery
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <motion.div
            ref={leftRef}
            initial={{ opacity: 0, x: -40 }}
            animate={leftInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9 }}
            className="rounded-3xl overflow-hidden aspect-[4/3]"
          >
            <img
              src={fullSrc(30)}
              alt="Sportswear cycling kit technical designs"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            ref={rightRef}
            initial={{ opacity: 0, x: 40 }}
            animate={rightInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9 }}
            className="flex flex-col justify-center gap-8"
          >
            <div>
              <p className="text-white/40 text-xs tracking-widest uppercase mb-4">
                Trend to Tech Pack
              </p>
              <p className="text-white/70 text-base md:text-lg leading-relaxed">
                Every range begins with trend and competitor research, translated into
                color stories, prints, and moodboards &mdash; then built out into technical
                flats, measurement charts, and construction detail ready for sampling.
              </p>
            </div>

            <div className="w-full h-px bg-white/10" />

            <div>
              <p className="text-white/40 text-xs tracking-widest uppercase mb-4">
                Sample to Shelf
              </p>
              <p className="text-white/70 text-base md:text-lg leading-relaxed">
                Fit reviews, vendor coordination, and production sign-off turn a sketch
                into a garment on a rail &mdash; sportswear, knitwear, kidswear, and
                lifestyle apparel built for Puma, FCUK, Myntra, Levi&rsquo;s, and Walmart.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
