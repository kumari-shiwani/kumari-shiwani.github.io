import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight, FileText } from 'lucide-react'
import { contact, fullSrc, galleryHighlights, selectedWork, thumbSrc } from '../lib/data'

function WorkCard({
  work,
  large,
  delay,
  onOpen,
}: {
  work: (typeof selectedWork)[number]
  large: boolean
  delay: number
  onOpen: () => void
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  return (
    <motion.button
      ref={ref}
      onClick={onOpen}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay }}
      className={`liquid-glass rounded-3xl overflow-hidden group text-left ${
        large ? 'md:col-span-2' : ''
      }`}
    >
      <div className={`relative overflow-hidden ${large ? 'aspect-video' : 'aspect-[4/3]'}`}>
        <img
          src={fullSrc(work.page)}
          alt={work.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-white/50 text-xs tracking-widest uppercase">
                {work.tag}
              </span>
              <h3 className="text-white text-xl md:text-2xl tracking-tight mt-2">
                {work.title}
              </h3>
            </div>
            <span className="liquid-glass bg-black/50 rounded-full p-2 shrink-0">
              <ArrowUpRight size={16} className="text-white" />
            </span>
          </div>
          <p className="text-white/70 text-sm leading-relaxed mt-3 max-w-md">
            {work.description}
          </p>
        </div>
      </div>
    </motion.button>
  )
}

export default function SelectedWorkSection({ onOpen }: { onOpen: (page: number) => void }) {
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-100px' })
  const stripRef = useRef(null)
  const stripInView = useInView(stripRef, { once: true, margin: '-100px' })

  return (
    <section id="work" className="py-28 md:py-40 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex items-end justify-between mb-12 md:mb-16"
        >
          <div>
            <p className="text-white/40 text-sm tracking-widest uppercase mb-4">
              Selected Work
            </p>
            <h2 className="text-4xl md:text-6xl text-white tracking-tight">
              A few collections worth a closer look.
            </h2>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16 md:mb-20">
          {selectedWork.map((work, i) => (
            <WorkCard
              key={work.page}
              work={work}
              large={i === 0}
              delay={i * 0.15}
              onOpen={() => onOpen(work.page)}
            />
          ))}
        </div>

        <motion.div
          ref={stripRef}
          initial={{ opacity: 0, y: 20 }}
          animate={stripInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-white/40 text-xs tracking-widest uppercase">
              More from the portfolio
            </p>
            <a
              href={contact.portfolioPdf}
              className="flex items-center gap-2 text-white/70 hover:text-white text-xs md:text-sm transition-colors"
            >
              <FileText size={14} /> Full portfolio PDF
            </a>
          </div>
          <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2">
            {galleryHighlights.map((page) => (
              <button
                key={page}
                onClick={() => onOpen(page)}
                className="liquid-glass rounded-xl overflow-hidden shrink-0 w-40 md:w-48 aspect-video"
              >
                <img
                  src={thumbSrc(page)}
                  alt={`Portfolio board ${page}`}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
