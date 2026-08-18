import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { fullSrc, galleryCount } from '../lib/data'

export default function Lightbox({
  page,
  onClose,
  onNavigate,
}: {
  page: number | null
  onClose: () => void
  onNavigate: (page: number) => void
}) {
  useEffect(() => {
    if (page === null) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onNavigate(page! === 1 ? galleryCount : page! - 1)
      if (e.key === 'ArrowRight') onNavigate(page! === galleryCount ? 1 : page! + 1)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [page, onClose, onNavigate])

  return (
    <AnimatePresence>
      {page !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center px-6"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="liquid-glass rounded-full p-3 absolute top-6 right-6 text-white"
          >
            <X size={20} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              onNavigate(page === 1 ? galleryCount : page - 1)
            }}
            aria-label="Previous"
            className="liquid-glass rounded-full p-3 absolute left-4 md:left-8 text-white"
          >
            <ChevronLeft size={20} />
          </button>

          <motion.img
            key={page}
            src={fullSrc(page)}
            alt={`Portfolio board ${page}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="max-w-full max-h-[85vh] rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => {
              e.stopPropagation()
              onNavigate(page === galleryCount ? 1 : page + 1)
            }}
            aria-label="Next"
            className="liquid-glass rounded-full p-3 absolute right-4 md:right-8 text-white"
          >
            <ChevronRight size={20} />
          </button>

          <span className="absolute bottom-6 text-white/50 text-xs tracking-widest uppercase">
            {page} / {galleryCount}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
