import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { galleryCount, thumbSrc } from '../lib/data'

export default function GallerySection({ onOpen }: { onOpen: (page: number) => void }) {
  const headingRef = useRef(null)
  const headingInView = useInView(headingRef, { once: true, margin: '-100px' })
  const pages = Array.from({ length: galleryCount }, (_, i) => i + 1)

  return (
    <section className="bg-black py-28 md:py-40 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex items-end justify-between mb-12 md:mb-16"
        >
          <div>
            <p className="text-white/40 text-sm tracking-widest uppercase mb-4">
              Portfolio Showroom
            </p>
            <h2 className="text-4xl md:text-6xl text-white tracking-tight">
              Every board, from the original portfolio.
            </h2>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => onOpen(page)}
              className="liquid-glass rounded-xl overflow-hidden aspect-video group"
            >
              <img
                src={thumbSrc(page)}
                alt={`Portfolio board ${page}`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
