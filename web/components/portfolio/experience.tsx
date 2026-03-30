import { experience } from "@/lib/site-content";

export function Experience() {
  return (
    <section
      id="experience"
      className="scroll-mt-20 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_35%,var(--bg))] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-14 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            Experience
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
            Where I’ve built & shipped
          </h2>
          <p className="mt-4 text-[var(--muted)]">
            Backend-focused roles and internships—impact, stack, and scope at a glance.
          </p>
        </div>

        {/* 
          Flex rail: timeline marker lives in a fixed-width column so it never 
          shares the same horizontal origin as the heading (fixes dots inside words).
        */}
        <ol className="relative m-0 list-none space-y-0 p-0">
          <span
            className="pointer-events-none absolute bottom-10 left-2.5 top-2 w-px -translate-x-1/2 bg-[var(--border)] sm:bottom-12"
            aria-hidden
          />

          {experience.map((item) => (
            <li
              key={`${item.company}-${item.start}`}
              className="flex gap-5 pb-12 last:pb-0 sm:gap-6"
            >
              <div className="relative w-5 shrink-0 pt-1 sm:w-5">
                <span
                  className="absolute left-1/2 top-[0.65rem] z-10 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-[var(--bg)] bg-[var(--accent)] ring-2 ring-[var(--bg)]"
                  aria-hidden
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between">
                  <div>
                    <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold leading-snug text-[var(--text)] sm:text-xl">
                      {item.role}
                    </h3>
                    <p className="mt-0.5 text-sm font-medium text-[var(--text)]">
                      {item.company}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm text-[var(--muted)]">
                    {item.start} — {item.end}
                    {item.current ? (
                      <span className="ml-2 rounded-md border border-[color-mix(in_oklab,var(--accent)_40%,var(--border))] px-2 py-0.5 text-xs font-medium text-[var(--accent)]">
                        Current
                      </span>
                    ) : null}
                  </p>
                </div>
                <p className="mt-1 text-sm text-[var(--muted)]">{item.location}</p>

                <ul className="mt-4 list-none space-y-2.5 p-0 text-sm leading-relaxed text-[var(--muted)]">
                  {item.highlights.map((h) => (
                    <li key={h.slice(0, 48)} className="flex gap-3">
                      <span
                        className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]"
                        aria-hidden
                      />
                      <span className="min-w-0 flex-1">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
