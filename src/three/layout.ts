import { BOARD_ASPECT, boards, chapters } from '../lib/data'

export const W = BOARD_ASPECT
export const GAP = 0.55
export const CH_GAP = 5.4
export const LINE_Y = 0.5

export const zOf = (s: number) => 1.5 * Math.sin(s * 0.052) + 2.4 * Math.sin(s * 0.016 + 1.2)
export const dzOf = (s: number) =>
  1.5 * 0.052 * Math.cos(s * 0.052) + 2.4 * 0.016 * Math.cos(s * 0.016 + 1.2)
export const yOf = (s: number) => LINE_Y + 0.16 * Math.sin(s * 0.043 + 0.4)

const boardS: number[] = []
const chapterS: number[] = []
{
  let x = 0
  let prev = -2
  boards.forEach((b, i) => {
    if (b.chapter !== prev) {
      const gap = b.chapter === -1 ? CH_GAP * 0.7 : CH_GAP
      if (b.chapter >= 0) chapterS[b.chapter] = x + gap / 2
      x += gap
      prev = b.chapter
    }
    boardS[i] = x + W / 2
    x += W + GAP
  })
}

export { boardS, chapterS }
export const S_START = chapterS[0] - 1.6
export const S_END = boardS[boardS.length - 1]

/** viewport heights of scroll per world unit along the thread */
export const SCROLL_PER_UNIT = 0.11

export const trackHeightVh = () => (S_END - S_START) * SCROLL_PER_UNIT * 100 + 100

export function sForProgress(p: number) {
  return S_START + p * (S_END - S_START)
}
export function progressForS(s: number) {
  return (s - S_START) / (S_END - S_START)
}

export function nearestBoard(s: number) {
  let best = 0
  let bd = Infinity
  for (let i = 0; i < boardS.length; i++) {
    const d = Math.abs(boardS[i] - s)
    if (d < bd) {
      bd = d
      best = i
    }
  }
  return { index: best, dist: bd }
}

export function chapterAt(s: number) {
  let c = -1
  for (let i = 0; i < chapters.length; i++) {
    if (s >= chapterS[i] - CH_GAP / 2 - 0.5) c = i
  }
  const last = boardS[boardS.length - 1]
  if (s > last - W) return -1
  return c
}

/** scrollY that centres the camera on world coordinate s */
export function scrollForS(s: number) {
  const work = document.getElementById('work')
  if (!work) return 0
  const top = work.offsetTop
  const len = work.offsetHeight - window.innerHeight
  return top + progressForS(s) * len
}
