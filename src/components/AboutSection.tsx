import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { stats } from '../lib/data'

export default function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" ref={ref} className="relative py-28 md:py-40 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.04)_0%,_transparent_70%)]" />

      <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-start">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="md:col-span-4"
        >
          <p className="text-white/40 text-sm tracking-widest uppercase mb-4">Designer Profile</p>
          <p className="text-white/60 text-base leading-relaxed">
            Based in India, working with brands worldwide. I turn a single question into a
            full seasonal range, and a full range into a garment someone actually wears.
          </p>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="md:col-span-8 text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight"
        >
          Turning concepts{' '}
          <em
            className="italic text-white/50"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            into collections
          </em>{' '}
          for brands that{' '}
          <em
            className="italic text-white/50"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            demand craft at scale.
          </em>
        </motion.h2>

        <div className="md:col-start-5 md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mt-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              className="liquid-glass rounded-2xl p-6"
            >
              <span
                className="block text-white text-4xl md:text-5xl mb-2"
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
