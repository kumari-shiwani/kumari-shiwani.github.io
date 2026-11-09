import { useCallback, useEffect, useRef, useState } from 'react'
import { Engine } from './three/Engine'
import { boardS, chapterS, scrollForS, sForProgress, trackHeightVh } from './three/layout'
import { boards } from './lib/data'
import Loader from './components/Loader'
import Header from './components/Header'
import HeroOverlay from './components/HeroOverlay'
import Hud from './components/Hud'
import ChapterLabels from './components/ChapterLabels'
import IndexOverlay from './components/IndexOverlay'
import Lightbox from './components/Lightbox'
import Cursor from './components/Cursor'
import Sections from './components/Sections'
import Fallback from './components/Fallback'
import IntroStages from './components/IntroStages'
import { useZone } from './lib/useZone'
import { useSlide } from './lib/useSlide'

function webglOK() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<Engine | null>(null)
  const labelRefs = useRef<(HTMLDivElement | null)[]>([])
  const progressRef = useRef<HTMLDivElement>(null)

  const [gl] = useState(webglOK)
  const [load, setLoad] = useState(0)
  const [ready, setReady] = useState(!gl)
  const [focus, setFocus] = useState(-1)
  const [chapter, setChapter] = useState(-2)
  const [hover, setHover] = useState<number | null>(null)
  const [open, setOpen] = useState<number | null>(null)
  const [indexMode, setIndexMode] = useState(false)
  const [introStage, setIntroStage] = useState(-1)
  const zone = useZone()
  useSlide(canvasRef, gl && ready && !indexMode && open === null)

  useEffect(() => {
    if (!gl || !canvasRef.current) return
    const engine = new Engine(canvasRef.current, {
      onLoadProgress: setLoad,
      onReady: () => setReady(true),
      onFocus: setFocus,
      onChapter: setChapter,
      onHover: setHover,
      onIntro: setIntroStage,
      onOpen: (i) => setOpen(i),
      onPick: (i) => {
        engine.snapTo(i)
        window.scrollTo({ top: scrollForS(boardS[i]), behavior: 'instant' as ScrollBehavior })
        setIndexMode(false)
      },
    })
    engine.setLabels(labelRefs.current)
    engine.setProgressEl(progressRef.current)
    engineRef.current = engine
    return () => engine.dispose()
  }, [gl])

  useEffect(() => {
    engineRef.current?.setIndex(indexMode)
    document.body.classList.toggle('locked', indexMode || open !== null || !ready)
  }, [indexMode, open, ready])

  useEffect(() => {
    document.body.style.cursor = hover !== null ? 'pointer' : ''
  }, [hover])

  useEffect(() => {
    engineRef.current?.setPaused(open !== null)
  }, [open])

  const goToBoard = useCallback((i: number) => {
    window.scrollTo({ top: scrollForS(boardS[i]), behavior: 'smooth' })
  }, [])
  /** next / previous board from wherever the line is, including the gaps between collections */
  const step = useCallback(
    (d: number) => {
      let i = focus + d
      if (focus < 0) {
        const wk = document.getElementById('work')
        if (!wk) return
        const p = Math.min(1, Math.max(0, (window.scrollY - wk.offsetTop) / Math.max(1, wk.offsetHeight - window.innerHeight)))
        const s = sForProgress(p)
        i = -1
        if (d > 0) i = boardS.findIndex((b) => b > s + 0.01)
        else for (let k = boardS.length - 1; k >= 0; k--) if (boardS[k] < s - 0.01) { i = k; break }
        if (i < 0) i = d > 0 ? boardS.length - 1 : 0
      }
      goToBoard(Math.max(0, Math.min(boards.length - 1, i)))
    },
    [focus, goToBoard],
  )
  const goToChapter = useCallback((c: number) => {
    window.scrollTo({ top: scrollForS(chapterS[c]), behavior: 'smooth' })
  }, [])

  const toggleIndex = useCallback(() => {
    if (!gl) return
    if (!indexMode && zone !== 'track') {
      window.scrollTo({ top: scrollForS(boardS[0]), behavior: 'instant' as ScrollBehavior })
      engineRef.current?.snapTo(0)
    }
    setIndexMode((v) => !v)
  }, [gl, indexMode, zone])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return
      if (open !== null) return
      if (e.key === 'Escape' && indexMode) setIndexMode(false)
      if ((e.key === 'i' || e.key === 'I') && !e.metaKey && !e.ctrlKey) toggleIndex()
      if (zone === 'track' && !indexMode) {
        if (e.key === 'ArrowRight') {
          e.preventDefault()
          step(1)
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          step(-1)
        }
        if (e.key === 'Enter' && focus >= 0) {
          // stop the same keypress from also "clicking" the viewer's Close button once it takes focus
          e.preventDefault()
          setOpen(focus)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, indexMode, zone, focus, toggleIndex, step])

  return (
    <>
      {gl && <canvas ref={canvasRef} className="fixed inset-0 h-full w-full z-0 touch-pan-y" aria-hidden />}
      <div className="grain" aria-hidden />

      <Header indexMode={indexMode} onIndex={toggleIndex} gl={gl} zone={zone} />

      {gl && (
        <>
          <ChapterLabels refs={labelRefs} />
          <HeroOverlay ready={ready} />
          <IntroStages stage={indexMode ? -1 : introStage} />
          <Hud
            show={zone === 'track' && !indexMode}
            focus={focus}
            chapter={chapter}
            progressRef={progressRef}
            onChapter={goToChapter}
            onOpen={() => focus >= 0 && setOpen(focus)}
            onStep={step}
          />
          <IndexOverlay show={indexMode} hover={hover} onClose={() => setIndexMode(false)} />
          <Cursor hover={hover} indexMode={indexMode} />
        </>
      )}

      <main className="relative z-[5] pointer-events-none">
        {gl ? (
          <>
            <section id="top" className="h-screen" aria-label="Introduction" />
            <section id="process-act" className="h-[340vh]" aria-label="How a collection is made" />
            <section
              id="work"
              aria-label="Portfolio boards"
              style={{ height: `${trackHeightVh()}vh` }}
            >
              <h2 className="sr-only">Selected work, eleven collections</h2>
            </section>
          </>
        ) : (
          <Fallback onOpen={setOpen} />
        )}
        <Sections />
      </main>

      <Lightbox
        index={open}
        onClose={() => setOpen(null)}
        onNavigate={(i) => {
          setOpen(i)
          if (gl && !indexMode) {
            engineRef.current?.snapTo(i)
            window.scrollTo({ top: scrollForS(boardS[i]), behavior: 'instant' as ScrollBehavior })
          }
        }}
      />

      {gl && <Loader progress={load} ready={ready} />}
    </>
  )
}
