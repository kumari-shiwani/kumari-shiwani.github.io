import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { experience } from '../lib/data'

function ExperienceCard({ item, delay }: { item: (typeof experience)[number]; delay: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay }}
      className="liquid-glass rounded-2xl p-6 md:p-8"
    >
      <span className="text-white/40 text-xs tracking-widest uppercase">{item.period}</span>
      <h3 className="text-white text-xl md:text-2xl tracking-tight mt-2 mb-3">
        {item.title} &middot; <span className="text-white/60">{item.org}</span>
      </h3>
      <p className="text-white/50 text-sm md:text-base leading-relaxed">{item.description}</p>
    </motion.article>
  )
}

export default function ExperienceSection() {
  const headingRef = useRef(null)
  const headingInView = useInView(headingRef, { once: true, margin: '-100px' })

  return (
    <section id="experience" className="bg-black py-28 md:py-40 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <p className="text-white/40 text-sm tracking-widest uppercase mb-4">
            Professional Journey
          </p>
          <h2 className="text-4xl md:text-6xl text-white tracking-tight">
            From commercial kidswear to full-range apparel leadership.
          </h2>
        </motion.div>

        <div className="flex flex-col gap-6">
          {experience.map((item, i) => (
            <ExperienceCard key={item.title} item={item} delay={i * 0.15} />
          ))}
        </div>
      </div>
    </section>
  )
}
