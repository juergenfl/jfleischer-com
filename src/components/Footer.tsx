export default function Footer() {
  return (
    <footer className="border-t border-border px-6 py-10 sm:px-10">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div className="flex items-baseline">
          <span className="font-display text-sm font-semibold tracking-tight">jfleischer</span>
          <span className="font-mono text-xs text-accent">.com</span>
        </div>

        <p className="font-mono text-xs text-fg-dim">Dr. Jürgen Fleischer, AI Automation Specialist</p>

        <p className="font-mono text-xs text-fg-dim">© 2026 jfleischer.com</p>
      </div>
    </footer>
  )
}
