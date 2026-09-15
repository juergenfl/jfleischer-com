import { labNotes } from '../data'

export default function LabNotes() {
  return (
    <section id="lab-notes" className="border-b border-border px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">[ Lab Notes ]</p>
            <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              What changed recently.
            </h2>
          </div>
          <p className="hidden font-mono text-xs text-fg-dim sm:block">SEC 03/04</p>
        </div>

        <ul className="divide-y divide-border border-y border-border">
          {labNotes.map((entry) => (
            <li key={entry.date} className="flex flex-col gap-1 py-6 sm:flex-row sm:items-baseline sm:gap-8">
              <span className="shrink-0 font-mono text-xs text-fg-dim">{entry.date}</span>
              <span className="text-fg">{entry.note}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
