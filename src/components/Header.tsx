import { Link, usePath } from '../router'

const LINK =
  'link-sweep shrink-0 py-2.5 font-mono text-xs uppercase tracking-[0.12em] text-fg-muted transition-colors hover:text-accent'

/**
 * One link, plus whatever the page wants beside it. The home page points at the
 * résumé and has the bar to itself, so its link sits right; every other page
 * points back home from the left and hands its own controls in as `aside`.
 */
export default function Header({ aside }: { aside?: React.ReactNode }) {
  const path = usePath()
  const onHome = (path.replace(/\/+$/, '') || '/') === '/'

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-transparent bg-bg/70 backdrop-blur-sm">
      <div
        className={`mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-6 sm:px-10 ${
          onHome ? 'justify-end' : 'justify-between'
        }`}
      >
        {onHome ? (
          <Link to="/lebenslauf" className={LINK}>
            About me
          </Link>
        ) : (
          <Link to="/" className={LINK}>
            ← jfleischer.com
          </Link>
        )}

        {aside}
      </div>
    </header>
  )
}
