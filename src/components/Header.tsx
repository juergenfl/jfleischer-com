import { useState } from 'react'
import { Link, usePath } from '../router'

const NAV = [
  { n: '01', label: 'Directory', href: '#directory' },
  { n: '02', label: 'Manifest', href: '#manifest' },
  { n: '03', label: 'Lab Notes', href: '#lab-notes' },
  { n: '04', label: 'Contact', href: '#contact' },
  { n: '05', label: 'About me', href: '/lebenslauf' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const path = usePath()
  const onHome = (path.replace(/\/+$/, '') || '/') === '/'

  // A bare "#section" only resolves on the home page. From anywhere else the
  // same entry has to travel home first, so it becomes a route link.
  const isRoute = (href: string) => !href.startsWith('#') || !onHome
  const target = (href: string) => (href.startsWith('#') ? `/${href}` : href)

  const renderNav = (
    className: (active: boolean) => string,
    label: (item: (typeof NAV)[number]) => React.ReactNode,
  ) =>
    NAV.map((item) => {
      const active = !item.href.startsWith('#') && item.href === path

      return isRoute(item.href) ? (
        <Link
          key={item.href}
          to={target(item.href)}
          className={className(active)}
          onNavigate={() => setOpen(false)}
          aria-current={active ? 'page' : undefined}
        >
          {label(item)}
        </Link>
      ) : (
        <a
          key={item.href}
          href={item.href}
          onClick={() => setOpen(false)}
          className={className(active)}
        >
          {label(item)}
        </a>
      )
    })

  const brand = (
    <>
      <span className="font-display text-lg font-semibold tracking-tight">jfleischer</span>
      <span className="font-mono text-xs text-accent">.com</span>
    </>
  )

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-transparent bg-bg/70 backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 sm:px-10">
        {onHome ? (
          <a href="#top" className="flex items-baseline py-2">
            {brand}
          </a>
        ) : (
          <Link to="/" className="flex items-baseline py-2">
            {brand}
          </Link>
        )}

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {renderNav(
            (active) =>
              `link-sweep py-2.5 font-mono text-xs uppercase tracking-[0.12em] transition-colors hover:text-accent ${
                active ? 'text-accent' : 'text-fg-muted'
              }`,
            (item) => (
              <>
                <span className="mr-1.5 opacity-70">{item.n}</span>
                {item.label}
              </>
            ),
          )}
        </nav>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            aria-hidden
            className={`h-px w-6 bg-current transition-transform duration-300 ${open ? 'translate-y-[3.5px] rotate-45' : ''}`}
          />
          <span
            aria-hidden
            className={`h-px w-6 bg-current transition-transform duration-300 ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`}
          />
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 flex flex-col justify-center bg-bg px-8 transition-[opacity,visibility] duration-300 md:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <nav aria-label="Mobile" className="space-y-2">
          {renderNav(
            (active) => `flex items-baseline gap-3 py-3 font-display text-2xl ${active ? 'text-accent' : ''}`,
            (item) => (
            <>
              <span className="font-mono text-sm text-accent">{item.n}</span>
              {item.label}
            </>
          ),
          )}
        </nav>
      </div>
    </header>
  )
}
