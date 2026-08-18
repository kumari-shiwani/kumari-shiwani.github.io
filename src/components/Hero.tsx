import { useEffect, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Linkedin, Mail, Phone, Shirt } from 'lucide-react'
import { contact, heroBoards } from '../lib/data'

const NAV_LINKS = [
  { href: '#studio', label: 'Studio' },
  { href: '#work', label: 'Work' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
]

function useRotatingIndex(length: number, intervalMs: number) {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % length), intervalMs)
    return () => clearInterval(id)
  }, [length, intervalMs])
  return index
}

export default function Hero() {
  const boardIndex = useRotatingIndex(heroBoards.length, 6000)
  const [email, setEmail] = useState('')
  const submitted = useRef(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    submitted.current = true
    const subject = encodeURIComponent('Project inquiry')
    const body = encodeURIComponent(
      `Hi Shiwani,\n\nI'd love to connect about a project.\n\nMy email: ${email}\n\n`,
    )
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`
  }

  return (
    <div className="min-h-screen overflow-hidden relative flex flex-col">
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence>
          <motion.img
            key={heroBoards[boardIndex]}
            src={heroBoards[boardIndex]}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-top"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.28 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/70" />
      </div>

      <nav className="relative z-20 px-6 py-6">
        <div className="liquid-glass rounded-full max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <a href="#home" className="flex items-center gap-2 text-white font-semibold text-lg">
              <Shirt size={22} className="text-white" />
              Shiwani Kumari
            </a>
            <div className="hidden md:flex items-center gap-8 ml-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-white/80 hover:text-white text-sm font-medium transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={contact.cv}
              download
              className="hidden sm:block text-white/80 hover:text-white text-sm font-medium transition-colors"
            >
              Download CV
            </a>
            <a
              href="#contact"
              className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium hover:bg-white/5 transition-colors"
            >
              Let&rsquo;s Talk
            </a>
          </div>
        </div>
      </nav>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[10%]">
        <h1
          className="text-6xl md:text-8xl lg:text-9xl text-white tracking-tight whitespace-nowrap mb-8"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Design, worn <em className="italic">well</em>.
        </h1>

        <p className="text-white text-sm leading-relaxed px-4 max-w-xl mb-8">
          Sportswear and knitwear designer building trend-led collections &mdash; from first
          moodboard to production sign-off, across kidswear, activewear, and womenswear.
        </p>

        <form onSubmit={handleSubmit} className="max-w-xl w-full mb-4">
          <div className="liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 bg-transparent outline-none text-white placeholder:text-white/40 text-sm"
            />
            <button
              type="submit"
              aria-label="Send"
              className="bg-white rounded-full p-3 text-black hover:bg-white/90 transition-colors"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </form>

        <p className="text-white/60 text-sm leading-relaxed px-4 max-w-lg mb-8">
          Have a project or role in mind? Leave your email and let&rsquo;s start the
          conversation &mdash; or reach out directly below.
        </p>

        <a
          href={contact.portfolioPdf}
          className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors"
        >
          View Full Portfolio
        </a>
      </div>

      <div className="relative z-10 flex justify-center gap-4 pb-12">
        <a
          href={contact.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"
        >
          <Linkedin size={20} />
        </a>
        <a
          href={`mailto:${contact.email}`}
          aria-label="Email"
          className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"
        >
          <Mail size={20} />
        </a>
        <a
          href={`tel:${contact.phoneHref}`}
          aria-label="Phone"
          className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"
        >
          <Phone size={20} />
        </a>
      </div>
    </div>
  )
}
