import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { process } from '../lib/data'

function ProcessCard({ step, delay }: { step: (typeof process)[number]; delay: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay }}
      className="liquid-glass rounded-3xl p-8 md:p-10 relative overflow-hidden"
    >
      <span
        className="absolute -top-4 -right-2 text-white/5 text-9xl select-none"
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
        {step.number}
      </span>
      <span className="relative text-white/40 text-xs tracking-widest uppercase">
        {step.number}
      </span>
      <h3 className="relative text-white text-2xl md:text-3xl tracking-tight mt-3 mb-4">
        {step.title}
      </h3>
      <p className="relative text-white/50 text-sm md:text-base leading-relaxed">
        {step.description}
      </p>
    </motion.div>
  )
}

export default function ProcessSection() {
  const headingRef = useRef(null)
  const headingInView = useInView(headingRef, { once: true, margin: '-100px' })

  return (
    <section id="process" className="bg-black py-28 md:py-40 px-6 overflow-hidden">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {process.map((step, i) => (
            <ProcessCard key={step.number} step={step} delay={i * 0.12} />
          ))}
        </div>
      </div>
    </section>
  )
}
