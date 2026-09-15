import { useEffect, useState, type ReactNode } from 'react'

const ROUTE_EVENT = 'app:routechange'

/** Push a new path and let every subscriber re-render. */
export function navigate(to: string) {
  if (to === window.location.pathname + window.location.hash) return
  window.history.pushState({}, '', to)
  window.dispatchEvent(new Event(ROUTE_EVENT))
}

/** Current pathname, kept in sync with back/forward and navigate(). */
export function usePath() {
  const [path, setPath] = useState(() => window.location.pathname)

  useEffect(() => {
    const sync = () => setPath(window.location.pathname)
    window.addEventListener('popstate', sync)
    window.addEventListener(ROUTE_EVENT, sync)
    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener(ROUTE_EVENT, sync)
    }
  }, [])

  return path
}

type LinkProps = {
  to: string
  children: ReactNode
  className?: string
  onNavigate?: () => void
  'aria-current'?: 'page'
}

/** Anchor that stays a real link for crawlers and cmd-click, but routes in-page. */
export function Link({ to, children, className, onNavigate, ...rest }: LinkProps) {
  return (
    <a
      {...rest}
      href={to}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        navigate(to)
        onNavigate?.()
      }}
    >
      {children}
    </a>
  )
}
