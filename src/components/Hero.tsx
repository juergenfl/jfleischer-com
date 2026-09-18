export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-dvh items-center overflow-hidden border-b border-border portrait:items-end"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 portrait:pb-32 sm:px-10">
        <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-7xl">
          jfleischer<span className="text-accent">.com</span>
        </h1>

        <p className="mt-6 max-w-xl text-lg text-fg-muted sm:text-xl">
          <span className="block">Dr. Jürgen Fleischer</span>
          <span className="block">AI Automation Specialist</span>
        </p>
      </div>

      <a
        href="#directory"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 font-mono text-xs uppercase tracking-[0.12em] text-fg-muted transition-colors hover:text-accent"
      >
        Scroll ↓
      </a>
    </section>
  )
}
