import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FileText, Linkedin, Mail, Phone } from 'lucide-react'
import { contact } from '../lib/data'

export default function ContactSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="contact" className="bg-black pt-10 pb-16 px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="liquid-glass rounded-3xl p-8 md:p-14 text-center"
        >
          <p className="text-white/40 text-sm tracking-widest uppercase mb-4">Contact</p>
          <h2
            className="text-4xl md:text-6xl text-white tracking-tight mb-6"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Let&rsquo;s build the next collection.
          </h2>
          <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-lg mx-auto mb-10">
            Available for full time apparel design roles, product development, technical
            design, and focused freelance capsules.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={`mailto:${contact.email}`}
              className="liquid-glass rounded-full px-6 py-3 text-white text-sm font-medium flex items-center gap-2 hover:bg-white/5 transition-colors"
            >
              <Mail size={16} /> Email
            </a>
            <a
              href={`tel:${contact.phoneHref}`}
              className="liquid-glass rounded-full px-6 py-3 text-white text-sm font-medium flex items-center gap-2 hover:bg-white/5 transition-colors"
            >
              <Phone size={16} /> {contact.phone}
            </a>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="liquid-glass rounded-full px-6 py-3 text-white text-sm font-medium flex items-center gap-2 hover:bg-white/5 transition-colors"
            >
              <Linkedin size={16} /> LinkedIn
            </a>
            <a
              href={contact.portfolioPdf}
              className="liquid-glass rounded-full px-6 py-3 text-white text-sm font-medium flex items-center gap-2 hover:bg-white/5 transition-colors"
            >
              <FileText size={16} /> Portfolio PDF
            </a>
          </div>
        </motion.div>

        <p className="text-center text-white/30 text-xs mt-10">
          &copy; {new Date().getFullYear()} Shiwani Kumari. All rights reserved.
        </p>
      </div>
    </section>
  )
}
