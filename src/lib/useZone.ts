import { useEffect, useState } from 'react'

export type Zone = 'hero' | 'track' | 'after'

export function getZone(): Zone {
  const work = document.getElementById('work')
  if (!work) return 'after'
  const y = window.scrollY
  const h = window.innerHeight
  if (y < work.offsetTop - h * 0.2) return 'hero'
  if (y < work.offsetTop + work.offsetHeight - h * 0.6) return 'track'
  return 'after'
}

export function useZone() {
  const [zone, setZone] = useState<Zone>('hero')
  useEffect(() => {
    let raf = 0
    const on = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setZone(getZone()))
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => {
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
    }
  }, [])
  return zone
}
