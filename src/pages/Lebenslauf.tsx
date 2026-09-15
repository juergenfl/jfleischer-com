import { useEffect, useMemo, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import {
  CONTENT,
  CV_PDF,
  CV_PORTRAIT,
  type FilterId,
  type Lang,
  type Quote,
} from '../cv/content'

function Pull({ quote }: { quote: Quote }) {
  return (
    <figure className="border-l-2 border-accent pl-6">
      <blockquote className="max-w-3xl text-lg leading-relaxed italic text-fg sm:text-xl">
        {quote.text}
      </blockquote>
      <figcaption className="mt-3 font-mono text-xs text-fg-muted">{quote.source}</figcaption>
    </figure>
  )
}

/** The home page's section header: kicker, heading, section counter. */
function SectionHead({
  kicker,
  heading,
  sec,
  action,
}: {
  kicker: string
  heading: string
  sec: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-16 flex items-end justify-between gap-4">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">[ {kicker} ]</p>
        <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {heading}
        </h2>
      </div>
      <div className="hidden shrink-0 items-center gap-6 sm:flex">
        {action}
        <p className="font-mono text-xs text-fg-dim">{sec}</p>
      </div>
    </div>
  )
}

const LANGS: Lang[] = ['de', 'en']

const GHOST_BUTTON =
  'border border-border px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] text-fg-muted transition-colors hover:border-accent hover:text-accent'

export default function Lebenslauf() {
  const [lang, setLang] = useState<Lang>('de')
  const [filter, setFilter] = useState<FilterId | null>(null)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ t1: true })

  const t = CONTENT[lang]

  useEffect(() => {
    const previous = document.documentElement.lang
    document.documentElement.lang = lang
    return () => {
      document.documentElement.lang = previous
    }
  }, [lang])

  const allIds = useMemo(() => t.timeline.map((st) => st.id), [t])
  const allOpen = allIds.every((id) => expanded[id])

  const toggleStation = (id: string) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  const toggleAll = () => setExpanded(Object.fromEntries(allIds.map((id) => [id, !allOpen])))

  const skills = t.skills.filter((sk) => !filter || sk.cats.includes(filter))
  const achievements = t.achievements.filter((a) => !filter || a.cats.includes(filter))

  const de = lang === 'de'

  return (
    <div className="flex min-h-full flex-col">
      <Header />

      <main id="main">
        {/* Sticky under the fixed site header, so language and the PDF stay
            reachable from anywhere on a long page. */}
        <div className="sticky top-16 z-30 mt-16 border-y border-border bg-bg/80 backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3 sm:px-10">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-fg-dim">
              {de ? 'Sprache' : 'Language'}
            </p>

            <div className="flex items-center gap-3">
              <div
                role="group"
                aria-label={de ? 'Sprache wählen' : 'Choose language'}
                className="flex items-center overflow-hidden rounded border border-border"
              >
                {LANGS.map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setLang(code)}
                    aria-pressed={lang === code}
                    className={`px-3 py-1.5 font-mono text-xs uppercase tracking-[0.12em] transition-colors ${
                      lang === code
                        ? 'bg-accent text-bg'
                        : 'text-fg-muted hover:text-accent'
                    }`}
                  >
                    {code}
                  </button>
                ))}
              </div>

              <a
                href={CV_PDF}
                download="Lebenslauf-Fleischer.pdf"
                className="rounded border border-border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.12em] text-fg-muted transition-colors hover:border-accent hover:text-accent"
              >
                PDF ↓
              </a>
            </div>
          </div>
        </div>

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section id="top" className="border-b border-border px-6 pt-20 pb-24 sm:px-10 sm:pt-24">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-[1.5fr_0.5fr]">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                [ {t.hero.kicker} ]
              </p>

              <h1 className="mt-6 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-6xl">
                {t.hero.name}
              </h1>

              <p className="mt-4 font-mono text-sm tracking-[0.08em] text-accent uppercase">
                {t.hero.role}
              </p>

              <p className="mt-8 max-w-xl text-lg leading-relaxed text-fg">{t.hero.intro}</p>

              <div className="mt-10 flex flex-wrap gap-x-12 gap-y-6">
                {t.hero.stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="font-mono text-xl font-medium text-fg">{stat.value}</div>
                    <div className="mt-1 text-sm text-fg-muted">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <a href={CV_PDF} download="Lebenslauf-Fleischer.pdf" className={GHOST_BUTTON}>
                  {t.nav.download} ↓
                </a>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs text-fg-muted">
                <a href={`mailto:${t.contact.email}`} className="link-sweep hover:text-accent">
                  {t.contact.email}
                </a>
                <span>{t.contact.phone}</span>
                <span>{t.contact.address}</span>
              </div>
            </div>

            <div className="relative order-first w-full max-w-[280px] justify-self-start lg:order-none lg:justify-self-center">
              <img
                src={CV_PORTRAIT}
                alt={t.hero.name}
                width={800}
                height={800}
                className="aspect-square w-full rounded-lg border border-border object-cover"
              />
              <span
                aria-hidden
                className="absolute -top-2 -left-2 h-6 w-6 border-t border-l border-accent"
              />
              <span
                aria-hidden
                className="absolute -right-2 -bottom-2 h-6 w-6 border-r border-b border-accent"
              />
            </div>
          </div>
        </section>

        {/* ── 01 Werdegang ─────────────────────────────────────── */}
        <section id="werdegang" className="scroll-mt-32 border-b border-border px-6 py-28 sm:px-10">
          <div className="mx-auto max-w-7xl">
            <SectionHead
              kicker={t.timelineHeading}
              heading={de ? '29 Jahre, eine Richtung.' : 'Twenty-nine years, one direction.'}
              sec="SEC 01/05"
              action={
                <button type="button" onClick={toggleAll} className={GHOST_BUTTON}>
                  {allOpen ? (de ? 'Kurzfassung' : 'Summary') : de ? 'Ausführlich' : 'Expand all'}
                </button>
              }
            />

            <ol className="border-l border-border">
              {t.timeline.map((st) => {
                const open = !!expanded[st.id]
                const hasDetails = st.steps.length > 0 || st.bullets.length > 0

                return (
                  <li key={st.id} className="relative pb-12 pl-8 last:pb-0">
                    <span
                      aria-hidden
                      className="absolute top-2 -left-[3.5px] h-1.5 w-1.5 rounded-full bg-accent"
                    />

                    <p className="font-mono text-xs tracking-[0.1em] text-fg">{st.period}</p>

                    <h3 className="mt-2 font-display text-xl font-semibold">{st.title}</h3>
                    {st.org && <p className="mt-1 text-sm text-fg">{st.org}</p>}

                    {st.summary && (
                      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-fg">
                        {st.summary}
                      </p>
                    )}

                    {hasDetails && open && (
                      <div className="mt-6 max-w-2xl border-l border-border pl-6">
                        {st.steps.map((step) => (
                          <div
                            key={step.period}
                            className="flex flex-col gap-1 py-2 font-mono text-xs sm:flex-row sm:gap-6"
                          >
                            <span className="shrink-0 text-fg sm:w-40">{step.period}</span>
                            <span className="text-fg">{step.title}</span>
                          </div>
                        ))}

                        {st.bullets.length > 0 && (
                          <ul className={st.steps.length > 0 ? 'mt-4 space-y-2' : 'space-y-2'}>
                            {st.bullets.map((b) => (
                              <li key={b} className="flex gap-3 text-sm leading-relaxed text-fg">
                                <span aria-hidden className="text-accent">
                                  ·
                                </span>
                                {b}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}

                    {hasDetails && (
                      <button
                        type="button"
                        onClick={() => toggleStation(st.id)}
                        className="link-sweep mt-4 font-mono text-xs uppercase tracking-[0.12em] text-accent"
                      >
                        {open ? (de ? '– weniger' : '– less') : de ? '+ Details' : '+ details'}
                      </button>
                    )}
                  </li>
                )
              })}
            </ol>

            <div className="mt-20">
              <Pull quote={t.quotes[0]} />
            </div>
          </div>
        </section>

        {/* ── 02 Kenntnisse ────────────────────────────────────── */}
        <section id="skills" className="scroll-mt-32 border-b border-border px-6 py-28 sm:px-10">
          <div className="mx-auto max-w-7xl">
            <SectionHead
              kicker={t.skillsHeading}
              heading={de ? 'Was ich mitbringe.' : 'What I bring.'}
              sec="SEC 02/05"
            />

            <p className="font-mono text-xs uppercase tracking-[0.2em] text-fg-dim">
              {t.filtersHeading}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {t.filters.map((f) => {
                const active = filter === f.id
                return (
                  <button
                    key={f.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilter((cur) => (cur === f.id ? null : f.id))}
                    className={`px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] transition-colors ${
                      active
                        ? 'border border-accent bg-accent text-bg'
                        : 'border border-border text-fg-muted hover:border-accent hover:text-accent'
                    }`}
                  >
                    {f.label}
                  </button>
                )
              })}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {skills.map((sk) => (
                <span
                  key={sk.label}
                  className="rounded border border-border bg-bg-elevated px-4 py-2 text-sm text-fg"
                >
                  {sk.label}
                </span>
              ))}
            </div>

            <div className="mt-20">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-fg-dim">
                {t.weiterbildungHeading}
              </p>
              <ul className="mt-6 divide-y divide-border border-y border-border">
                {t.weiterbildung.map((w, i) => (
                  <li
                    key={w}
                    className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-8"
                  >
                    <span className="shrink-0 font-mono text-xs text-fg-dim">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm text-fg">{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-20">
              <Pull quote={t.quotes[1]} />
            </div>
          </div>
        </section>

        {/* ── 03 Erfolge ───────────────────────────────────────── */}
        <section id="achievements" className="scroll-mt-32 border-b border-border px-6 py-28 sm:px-10">
          <div className="mx-auto max-w-7xl">
            <SectionHead
              kicker={t.achievementsHeading}
              heading={de ? 'Was dabei herauskam.' : 'What came of it.'}
              sec="SEC 03/05"
            />

            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border/60 md:grid-cols-2">
              {achievements.map((a, i) => (
                <div
                  key={a.title}
                  className="flex flex-col gap-4 bg-bg p-8 transition-colors hover:bg-bg-elevated"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-xs text-fg-dim">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-display text-lg font-semibold">{a.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-fg">{a.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-20">
              <Pull quote={t.quotes[2]} />
            </div>
          </div>
        </section>

        {/* ── 04 Stärken & Interessen ──────────────────────────── */}
        <section id="strengths" className="scroll-mt-32 border-b border-border px-6 py-28 sm:px-10">
          <div className="mx-auto max-w-7xl">
            <SectionHead
              kicker={t.strengthsHeading}
              heading={de ? 'Wie ich arbeite.' : 'How I work.'}
              sec="SEC 04/05"
            />

            <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
              {[
                { title: t.strengthsHeading, items: t.strengths },
                { title: t.interestsHeading, items: t.interests },
              ].map((col, i) => (
                <div key={col.title}>
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-xs text-fg-dim">0{i + 1}</span>
                    <h3 className="font-display text-xl font-semibold">{col.title}</h3>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {col.items.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-relaxed text-fg">
                        <span aria-hidden className="text-accent">
                          ·
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 05 Zeugnis ───────────────────────────────────────── */}
        <section id="reference" className="scroll-mt-32 px-6 py-28 sm:px-10">
          <div className="mx-auto max-w-7xl">
            <SectionHead
              kicker={t.referenceHeading}
              heading={de ? 'Zum Abschied.' : 'On leaving.'}
              sec="SEC 05/05"
            />

            <p className="max-w-2xl text-sm leading-relaxed text-fg">{t.referenceText}</p>

            <div className="mt-12">
              <Pull quote={t.quotes[3]} />
            </div>

            <div className="mt-16 flex flex-wrap items-center gap-3">
              <a href={CV_PDF} download="Lebenslauf-Fleischer.pdf" className={GHOST_BUTTON}>
                {t.footer.download} ↓
              </a>
              <a href={`mailto:${t.contact.email}`} className={GHOST_BUTTON}>
                {t.footer.heading} →
              </a>
              <span className="font-mono text-xs text-fg-dim">{t.footer.smallprint}</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
