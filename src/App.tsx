import { Suspense, lazy, useEffect } from 'react'
import { usePath } from './router'

// Split per route: the home page pulls in three.js (~1 MB), which the
// résumé page has no use for.
const Home = lazy(() => import('./pages/Home'))
const Lebenslauf = lazy(() => import('./pages/Lebenslauf'))

const TITLES: Record<string, string> = {
  '/': 'jfleischer.com — Dr. Jürgen Fleischer, AI Automation Specialist',
  '/lebenslauf': 'Interaktiver Lebenslauf — Dr. Jürgen Fleischer',
}

export default function App() {
  const path = usePath()
  const route = path.replace(/\/+$/, '') || '/'

  useEffect(() => {
    document.title = TITLES[route] ?? TITLES['/']

    const hash = window.location.hash
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }

    // Arriving at "/#directory" from another route: the section lives in a
    // lazily loaded chunk, so wait for it to mount before scrolling.
    let frames = 0
    let raf = requestAnimationFrame(function attempt() {
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView()
      } else if (frames++ < 90) {
        raf = requestAnimationFrame(attempt)
      }
    })
    return () => cancelAnimationFrame(raf)
  }, [route])

  return (
    <Suspense fallback={<div className="min-h-screen bg-bg" />}>
      {route === '/lebenslauf' ? <Lebenslauf /> : <Home />}
    </Suspense>
  )
}
