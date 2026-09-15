export default function Contact() {
  return (
    <section id="contact" className="px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">[ Submit ]</p>
        <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
          Dr. Jürgen Fleischer, AI Automation Specialist
        </h2>
        <p className="mt-6 max-w-xl text-fg-dim">
          Send it over. If it earns its place after a real run, it goes in the directory —
          credited to whoever pointed us to it.
        </p>

        <a
          href="mailto:info@jfleischer.com"
          className="group mt-10 inline-flex items-center gap-3 border border-border px-6 py-4 font-mono text-xs uppercase tracking-[0.12em] transition-colors hover:border-accent hover:text-accent"
        >
          Suggest a tool
          <span aria-hidden className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </a>
      </div>
    </section>
  )
}
