import { aboutParagraphs } from "@/lib/site-content";

export function About() {
  return (
    <section
      id="about"
      className="scroll-mt-20 border-b border-[var(--border)] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-10 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            About
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
            APIs, data, and systems that ship
          </h2>
        </div>
        <div className="grid gap-8 lg:grid-cols-[1fr_280px] lg:gap-12">
          <div className="space-y-5 text-[17px] leading-[1.75] text-[var(--muted)]">
            {aboutParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <aside className="h-fit rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 lg:sticky lg:top-24">
            <h3 className="text-sm font-semibold text-[var(--text)]">
              Focus areas
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                Go, Node.js & REST / gRPC APIs
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                PostgreSQL, MongoDB, Redis, ArangoDB
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                Performance, real-time systems & Docker / AWS
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
