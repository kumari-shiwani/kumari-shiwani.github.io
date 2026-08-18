import { useState } from 'react'
import { ChevronDown, Linkedin, Mail, Phone, Shirt } from 'lucide-react'
import { contact } from '../lib/data'

const NAV_LINKS = [
  { href: '#process', label: 'Process' },
  { href: '#work', label: 'Work' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
]

export default function Hero() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen overflow-hidden relative flex flex-col">
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
          <div className="hidden sm:flex items-center gap-4">
            <a
              href={contact.cv}
              download
              className="text-white/80 hover:text-white text-sm font-medium transition-colors"
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
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle navigation"
            className="sm:hidden text-white liquid-glass rounded-full p-2"
          >
            <ChevronDown
              size={20}
              className={`transition-transform ${menuOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
        {menuOpen && (
          <div className="liquid-glass rounded-3xl max-w-5xl mx-auto mt-3 px-6 py-4 flex flex-col gap-4 sm:hidden">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-white/80 text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
            <a href={contact.cv} download className="text-white/80 text-sm font-medium">
              Download CV
            </a>
          </div>
        )}
      </nav>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        <p className="text-white/50 text-xs md:text-sm tracking-[0.3em] uppercase mb-6">
          Sportswear &amp; Knitwear Designer
        </p>

        <h1
          className="text-6xl md:text-8xl lg:text-9xl text-white tracking-tight whitespace-nowrap mb-8"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          From sketch to <em className="italic">shelf</em>.
        </h1>

        <p className="text-white/70 text-sm md:text-base leading-relaxed px-4 max-w-xl mb-10">
          I build trend led collections for global apparel brands, carrying every idea
          from the first moodboard through fit, sampling, and production approval.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#work"
            className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors"
          >
            View Selected Work
          </a>
          <a
            href="#contact"
            className="rounded-full px-8 py-3 bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors"
          >
            Start a Conversation
          </a>
        </div>
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
