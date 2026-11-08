import { useEffect, useState } from 'react'
import { contact } from '../lib/data'
import type { Zone } from '../lib/useZone'

type Props = { indexMode: boolean; onIndex: () => void; gl: boolean; zone: Zone }

export default function Header({ indexMode, onIndex, gl, zone }: Props) {
  const [menu, setMenu] = useState(false)
  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setMenu(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }
  useEffect(() => {
    if (!menu) return
    const close = () => setMenu(false)
    const onDown = (e: PointerEvent) => !(e.target as HTMLElement).closest?.('[data-menu]') && close()
    window.addEventListener('scroll', close, { passive: true })
    window.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('scroll', close)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [menu])
  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 md:px-8 py-3 md:py-5 pointer-events-none transition-[background-color,box-shadow] duration-500 ${
        zone === 'after' ? 'bg-card/85 backdrop-blur-md shadow-[0_1px_0_rgba(23,21,18,0.08)]' : ''
      }`}
    >
      <a
        href="#top"
        onClick={(e) => {
          e.preventDefault()
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        className="pointer-events-auto flex items-center gap-3 group"
        aria-label="Shiwani Kumari, back to top"
      >
        <span className="relative grid place-items-center w-9 h-9 rounded-full bg-sun">
          <span className="font-serif italic text-[17px] leading-none translate-y-[1px]">SK</span>
          <span className="absolute left-[-6px] right-[-6px] top-1/2 h-[1.5px] bg-thread rotate-[-8deg] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </span>
        <span className="hidden sm:flex flex-col leading-tight">
          <span className="text-[13px] font-medium">Shiwani Kumari</span>
          <span className="eyebrow text-muted !text-[9.5px]">Sportswear & Knitwear</span>
        </span>
      </a>

      <nav className="pointer-events-auto flex items-center gap-1 md:gap-2 text-[13px]" aria-label="Main">
        {gl && (
          <button
            onClick={onIndex}
            className={`flex items-center gap-2 rounded-full px-4 py-2 transition-colors ${
              indexMode ? 'bg-ink text-card' : 'bg-card/80 backdrop-blur hover:bg-ink hover:text-card'
            }`}
            aria-pressed={indexMode}
          >
            <span className="relative w-3.5 h-3.5">
              <span className={`absolute inset-0 rounded-full border border-current transition-transform ${indexMode ? 'scale-50' : ''}`} />
              <span className="absolute left-0 right-0 top-1/2 h-px bg-current" />
            </span>
            {indexMode ? 'Close index' : 'Index'}
          </button>
        )}
        <a
          href="#work"
          onClick={go('work')}
          className={`hidden md:inline rounded-full px-3 py-2 link-thread ${zone === 'track' ? 'text-thread' : ''}`}
        >
          Work
        </a>
        <a href="#about" onClick={go('about')} className="hidden md:inline rounded-full px-3 py-2 link-thread">
          About
        </a>
        <a href="#contact" onClick={go('contact')} className="hidden md:inline rounded-full px-3 py-2 link-thread">
          Contact
        </a>
        <a
          href={contact.cv}
          download
          className="hidden sm:inline-flex rounded-full px-4 py-2 border border-ink/80 hover:bg-ink hover:text-card transition-colors"
        >
          CV ↓
        </a>

        {/* phones: the same links as the laptop header, folded into a menu */}
        <div className="relative md:hidden" data-menu>
          <button
            onClick={() => setMenu((v) => !v)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 transition-colors ${menu ? 'bg-ink text-card' : 'bg-card/80 backdrop-blur'}`}
            aria-expanded={menu}
            aria-controls="mobile-menu"
          >
            <span className="relative w-3.5 h-2.5" aria-hidden>
              <span className={`absolute left-0 right-0 h-px bg-current transition-transform ${menu ? 'top-1/2 rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 right-0 h-px bg-current transition-transform ${menu ? 'top-1/2 -rotate-45' : 'bottom-0'}`} />
            </span>
            Menu
          </button>
          <div
            id="mobile-menu"
            className={`absolute right-0 top-full mt-2 w-56 rounded-2xl bg-card shadow-[0_20px_50px_-20px_rgba(23,21,18,0.45)] border border-ink/10 p-2 origin-top-right transition-all duration-300 ${
              menu ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
            }`}
          >
            {[
              ['work', 'Work'],
              ['about', 'About'],
              ['experience', 'Experience'],
              ['contact', 'Contact'],
            ].map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={go(id)}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-[15px] active:bg-paper ${zone === 'track' && id === 'work' ? 'text-thread' : ''}`}
              >
                {label}
                <span className="eyebrow text-muted">→</span>
              </a>
            ))}
            <a
              href={contact.cv}
              download
              onClick={() => setMenu(false)}
              className="mt-1 flex items-center justify-between rounded-xl px-4 py-3 text-[15px] bg-ink text-card"
            >
              Download CV <span>↓</span>
            </a>
          </div>
        </div>
      </nav>
    </header>
  )
}
