import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { capabilities } from '../lib/data'

export default function CapabilitiesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const half = Math.ceil(capabilities.length / 2)
  const rowA = [...capabilities.slice(0, half), ...capabilities.slice(0, half)]
  const rowB = [...capabilities.slice(half), ...capabilities.slice(half)]

  return (
    <section className="relative py-28 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.03)_0%,_transparent_60%)]" />

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="relative max-w-6xl mx-auto px-6 mb-16"
      >
        <p className="text-white/40 text-sm tracking-widest uppercase mb-4">Core Craft</p>
        <h2 className="text-4xl md:text-6xl text-white tracking-tight max-w-2xl">
          Comfortable moving between imagination and factory detail.
        </h2>
      </motion.div>

      <div className="relative flex flex-col gap-6">
        <div className="overflow-hidden">
          <div className="marquee-track flex items-center gap-4 whitespace-nowrap">
            {rowA.map((item, i) => (
              <span
                key={`a-${item}-${i}`}
                className="liquid-glass rounded-full px-6 py-3 text-white/80 text-sm md:text-base shrink-0"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="overflow-hidden">
          <div className="marquee-track-reverse flex items-center gap-4 whitespace-nowrap">
            {rowB.map((item, i) => (
              <span
                key={`b-${item}-${i}`}
                className="liquid-glass rounded-full px-6 py-3 text-white/80 text-sm md:text-base shrink-0"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
