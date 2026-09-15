import { pillars } from '../data'

export default function Manifest() {
  return (
    <section id="manifest" className="border-b border-border px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">[ Manifest ]</p>
            <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Why trust the list.
            </h2>
          </div>
          <p className="hidden font-mono text-xs text-fg-dim sm:block">SEC 02/04</p>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {pillars.map((p, i) => (
            <div key={p.title}>
              <span className="font-mono text-xs text-fg-dim">0{i + 1}</span>
              <h3 className="mt-3 font-display text-xl font-semibold">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-fg-dim">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
