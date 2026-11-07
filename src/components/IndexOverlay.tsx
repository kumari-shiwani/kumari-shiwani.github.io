import { boards, chapters } from '../lib/data'

type Props = { show: boolean; hover: number | null; onClose: () => void }

export default function IndexOverlay({ show, hover, onClose }: Props) {
  const b = hover !== null ? boards[hover] : null
  return (
    <div
      className="fixed inset-0 z-20 pointer-events-none transition-opacity duration-700"
      style={{ opacity: show ? 1 : 0, visibility: show ? 'visible' : 'hidden', transitionDelay: show ? '0.5s' : '0s' }}
      aria-hidden={!show}
    >
      <div className="absolute bottom-6 md:bottom-8 inset-x-4 md:inset-x-8 flex items-end justify-between gap-6">
        <div>
        <p className="eyebrow text-thread">The archive</p>
        <p className="font-serif italic text-3xl md:text-4xl mt-1 mb-3">82 boards around you</p>
        <p className="eyebrow text-muted max-w-[16rem]">
          <span className="hidden md:inline">Drag, scroll or move to the edge to turn</span>
          <span className="md:hidden">Swipe to turn</span>
          <br />
          Select a board to fly to it
        </p>
        </div>
        <div className="text-center min-h-[3.5rem]">
          {b && (
            <div key={hover} className="fade-swap">
              <p className="eyebrow text-muted">
                {b.chapter >= 0 ? `${chapters[b.chapter].no} ${chapters[b.chapter].title}` : 'Fin'} · Board{' '}
                {String(b.page).padStart(2, '0')}
              </p>
              <p className="font-serif text-3xl md:text-4xl leading-tight">{b.title}</p>
            </div>
          )}
        </div>
        <button onClick={onClose} className="pointer-events-auto eyebrow hover:text-thread transition-colors">
          Esc · Back to the line
        </button>
      </div>
    </div>
  )
}
