import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { experience } from '../lib/data'

function ExperienceRow({ item, delay }: { item: (typeof experience)[number]; delay: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="relative pl-10 md:pl-14 pb-14 last:pb-0"
    >
      <span className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-white" />
      <span className="absolute left-[5px] top-5 bottom-0 w-px bg-white/15" />

      <span className="text-white/40 text-xs tracking-widest uppercase">{item.period}</span>
      <h3 className="text-white text-xl md:text-2xl tracking-tight mt-2 mb-3">
        {item.title} <span className="text-white/40">at</span>{' '}
        <span className="text-white/70">{item.org}</span>
      </h3>
      <p className="text-white/50 text-sm md:text-base leading-relaxed max-w-2xl">
        {item.description}
      </p>
    </motion.article>
  )
}

export default function ExperienceSection() {
  const headingRef = useRef(null)
  const headingInView = useInView(headingRef, { once: true, margin: '-100px' })

  return (
    <section id="experience" className="py-28 md:py-40 px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto">
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
            From commercial kidswear to full range apparel leadership.
          </h2>
        </motion.div>

        <div>
          {experience.map((item, i) => (
            <ExperienceRow key={item.title} item={item} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  )
}
