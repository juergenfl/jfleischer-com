import { categories } from '../data'
import { setHoveredCluster } from '../three/sceneState'

export default function Directory() {
  return (
    <section id="directory" className="border-b border-border px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">[ Directory ]</p>
            <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Six categories, one running list.
            </h2>
          </div>
          <p className="hidden font-mono text-xs text-fg-dim sm:block">SEC 01/04</p>
        </div>

        <div
          className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border/60 md:grid-cols-2 lg:grid-cols-3"
          onPointerLeave={() => setHoveredCluster(-1)}
        >
          {categories.map((cat, i) => (
            <div
              key={cat.index}
              className="flex flex-col gap-5 bg-bg/80 p-8 transition-colors hover:bg-bg/60"
              onPointerEnter={() => setHoveredCluster(i)}
              onFocusCapture={() => setHoveredCluster(i)}
              onBlurCapture={() => setHoveredCluster(-1)}
            >
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-fg-dim">{cat.index}</span>
                <h3 className="font-display text-lg font-semibold">{cat.title}</h3>
              </div>
              <p className="text-sm text-fg-dim">{cat.description}</p>

              <ul className="mt-2 space-y-4">
                {cat.tools.map((tool) => (
                  <li key={tool.name}>
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noreferrer"
                      className="link-sweep group flex items-baseline justify-between gap-2"
                    >
                      <span className="font-medium text-fg group-hover:text-accent">{tool.name}</span>
                      <span
                        className={`shrink-0 font-mono text-[10px] uppercase tracking-[0.1em] ${
                          tool.tag === 'Tested' ? 'text-accent' : 'text-amber'
                        }`}
                      >
                        {tool.tag}
                      </span>
                    </a>
                    <p className="mt-1 text-sm text-fg-dim">{tool.blurb}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
