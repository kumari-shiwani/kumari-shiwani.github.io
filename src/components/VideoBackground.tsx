import { useEffect, useRef } from 'react'
import { heroVideo } from '../lib/data'

function animateOpacity(el: HTMLElement, from: number, to: number, duration: number) {
  const start = performance.now()
  function step(now: number) {
    const t = Math.min((now - start) / duration, 1)
    el.style.opacity = String(from + (to - from) * t)
    if (t < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    function handleCanPlay() {
      video!.play().catch(() => {})
      animateOpacity(video!, 0, 1, 700)
    }

    function handleTimeUpdate() {
      const remaining = video!.duration - video!.currentTime
      if (remaining <= 0.55 && remaining > 0) {
        animateOpacity(video!, Number(video!.style.opacity || 1), 0, 500)
      }
    }

    function handleEnded() {
      video!.style.opacity = '0'
      setTimeout(() => {
        video!.currentTime = 0
        video!.play().catch(() => {})
        animateOpacity(video!, 0, 1, 500)
      }, 100)
    }

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)
    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
    }
  }, [])

  return (
    <div className="fixed inset-0 w-full h-full bg-black -z-10">
      <video
        ref={videoRef}
        src={heroVideo}
        muted
        autoPlay
        playsInline
        preload="auto"
        style={{ opacity: 0, filter: 'brightness(1.25) saturate(1.15) contrast(1.03)' }}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/55" />
    </div>
  )
}
