import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { capabilities, fullSrc } from '../lib/data'

const SERVICES = [
  {
    page: 45,
    tag: 'Technical Design',
    title: 'Tech Packs & Fit',
    description:
      'Detailed tech packs, technical flats, measurement charts, fit notes, and construction callouts that keep design intent intact from first sketch to final sample.',
  },
  {
    page: 60,
    tag: 'Product Development',
    title: 'Range & Print Development',
    description:
      'Trend-led range planning, original print and graphic development, and fabric and trim sourcing across knitwear, activewear, and kidswear categories.',
  },
]

function ServiceCard({ service, delay }: { service: (typeof SERVICES)[number]; delay: number }) {
  const cardRef = useRef(null)
  const cardInView = useInView(cardRef, { once: true, margin: '-100px' })
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={cardInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay }}
      className="liquid-glass rounded-3xl overflow-hidden group"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={fullSrc(service.page)}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
      <div className="p-6 md:p-8">
        <div className="flex items-start justify-between mb-4">
          <span className="text-white/40 text-xs tracking-widest uppercase">
            {service.tag}
          </span>
          <span className="liquid-glass rounded-full p-2">
            <ArrowUpRight size={16} className="text-white" />
          </span>
        </div>
        <h3 className="text-white text-xl md:text-2xl mb-3 tracking-tight">{service.title}</h3>
        <p className="text-white/50 text-sm leading-relaxed">{service.description}</p>
      </div>
    </motion.div>
  )
}

export default function ServicesSection() {
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-100px' })
  const tagsRef = useRef(null)
  const tagsInView = useInView(tagsRef, { once: true, margin: '-100px' })

  return (
    <section className="relative bg-black py-28 md:py-40 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.02)_0%,_transparent_60%)]" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex items-end justify-between mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl text-white tracking-tight">What I do</h2>
          <span className="hidden md:block text-white/40 text-sm">Core Craft</span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16 md:mb-20">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.title} service={service} delay={i * 0.15} />
          ))}
        </div>

        <motion.div
          ref={tagsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={tagsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-white/40 text-xs tracking-widest uppercase mb-4">
            Also skilled in
          </p>
          <div className="flex flex-wrap gap-3">
            {capabilities.map((capability) => (
              <span
                key={capability}
                className="liquid-glass rounded-full px-4 py-2 text-white/70 text-xs md:text-sm"
              >
                {capability}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
