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
      {/* narrow screens: a paper fade so the text never sits on the boards */}
      <div className="md:hidden absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-paper via-paper/90 to-transparent" />

      <div className="absolute bottom-5 md:bottom-8 inset-x-4 md:inset-x-8 flex flex-wrap md:flex-nowrap items-end justify-between gap-x-6 gap-y-4">
        <div className="order-2 md:order-none">
          <p className="eyebrow text-thread">The archive</p>
          <p className="font-serif italic text-2xl md:text-4xl mt-1 mb-2 md:mb-3 [@media(max-height:500px)]:hidden">82 boards around you</p>
          <p className="eyebrow text-muted max-w-[16rem] [@media(max-height:500px)]:hidden">
            <span className="[@media(hover:none)]:hidden">Drag, scroll or move to the edge to turn</span>
            <span className="hidden [@media(hover:none)]:inline">Swipe to turn</span>
            <br />
            <span className="[@media(hover:none)]:hidden">Select</span>
            <span className="hidden [@media(hover:none)]:inline">Tap</span> a board to fly to it
          </p>
        </div>
        <div className="order-1 md:order-none w-full md:w-auto md:flex-1 text-center min-h-[3.5rem]">
          {b && (
            <div key={hover} className="fade-swap">
              <p className="eyebrow text-muted">
                {b.chapter >= 0 ? `${chapters[b.chapter].no} ${chapters[b.chapter].title}` : 'Fin'} · Board{' '}
                {String(b.page).padStart(2, '0')}
              </p>
              <p className="font-serif text-2xl md:text-4xl leading-tight">{b.title}</p>
            </div>
          )}
        </div>
        <button onClick={onClose} className="order-3 md:order-none pointer-events-auto eyebrow hover:text-thread transition-colors py-2 text-right">
          <span className="[@media(hover:none)]:hidden">Esc · </span>Back to the line
        </button>
      </div>
    </div>
  )
}
