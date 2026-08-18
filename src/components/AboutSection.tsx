import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { stats } from '../lib/data'

export default function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      id="studio"
      ref={ref}
      className="relative bg-black pt-32 md:pt-44 pb-10 md:pb-14 px-6 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.03)_0%,_transparent_70%)]" />

      <div className="relative max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-white/40 text-sm tracking-widest uppercase mb-6"
        >
          Designer Profile
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight mb-16"
        >
          Turning concepts{' '}
          <em
            className="italic text-white/60"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            into collections
          </em>{' '}
          for
          <br className="hidden md:block" /> brands that{' '}
          <em
            className="italic text-white/60"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            demand craft, at scale.
          </em>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.metric}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              className="liquid-glass rounded-2xl p-6"
            >
              <span
                className="block text-white text-3xl md:text-4xl mb-2"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                {stat.metric}
              </span>
              <span className="text-white/50 text-sm leading-relaxed">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
