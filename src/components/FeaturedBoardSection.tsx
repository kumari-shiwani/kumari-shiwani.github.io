import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { fullSrc } from '../lib/data'

export default function FeaturedBoardSection({
  onOpen,
}: {
  onOpen: (page: number) => void
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const featuredPage = 4

  return (
    <section id="work" className="bg-black pt-6 md:pt-10 pb-20 md:pb-32 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="relative rounded-3xl overflow-hidden aspect-video"
        >
          <img
            src={fullSrc(featuredPage)}
            alt="Featured portfolio board: Walmart kidswear brand board"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div className="liquid-glass bg-black/50 rounded-2xl p-6 md:p-8 max-w-md">
              <p className="text-white/50 text-xs tracking-widest uppercase mb-3">
                Our Approach
              </p>
              <p className="text-white text-sm md:text-base leading-relaxed">
                Every collection starts with a question: what does the customer need, and
                how does it perform? From moodboard to tech pack to production floor, I
                chase the answer down to the last stitch.
              </p>
            </div>

            <motion.button
              onClick={() => onOpen(featuredPage)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="liquid-glass bg-black/50 rounded-full px-8 py-3 text-white text-sm font-medium"
            >
              View Full Board
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
