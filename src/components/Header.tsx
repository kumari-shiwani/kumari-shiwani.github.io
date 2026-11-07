import { contact } from '../lib/data'
import type { Zone } from '../lib/useZone'

type Props = { indexMode: boolean; onIndex: () => void; gl: boolean; zone: Zone }

export default function Header({ indexMode, onIndex, gl, zone }: Props) {
  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 md:px-8 py-4 md:py-5 pointer-events-none">
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
        <a href="#contact" onClick={go('contact')} className="rounded-full px-3 py-2 link-thread">
          Contact
        </a>
        <a
          href={contact.cv}
          download
          className="hidden sm:inline-flex rounded-full px-4 py-2 border border-ink/80 hover:bg-ink hover:text-card transition-colors"
        >
          CV ↓
        </a>
      </nav>
    </header>
  )
}
