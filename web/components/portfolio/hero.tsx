import { site } from "@/lib/site-content";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--border)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        aria-hidden
      >
        <div className="absolute -left-1/4 top-0 h-[420px] w-[70%] rounded-full bg-[radial-gradient(ellipse_at_center,_var(--glow-1)_0%,_transparent_65%)] blur-3xl" />
        <div className="absolute -right-1/4 bottom-0 h-[380px] w-[60%] rounded-full bg-[radial-gradient(ellipse_at_center,_var(--glow-2)_0%,_transparent_65%)] blur-3xl" />
      </div>
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-[0.35]" aria-hidden />
      <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-16 sm:pb-28 sm:pt-24">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
          {site.title}
          <span className="h-1 w-1 rounded-full bg-[var(--accent)]" />
          {site.location}
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.08] tracking-tight text-[var(--text)] sm:text-5xl sm:leading-[1.06] lg:text-6xl">
          {site.name}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--muted)] sm:text-xl">
          {site.tagline}
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href={site.github}
            className="inline-flex h-11 items-center justify-center rounded-lg bg-[var(--text)] px-6 text-sm font-semibold text-[var(--bg)] transition-opacity hover:opacity-90"
            target="_blank"
            rel="noopener noreferrer"
          >
            View GitHub
          </a>
          <a
            href={`mailto:${site.email}`}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] px-6 text-sm font-semibold text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Get in touch
          </a>
          {site.resumeUrl ? (
            <a
              href={site.resumeUrl}
              className="inline-flex h-11 items-center justify-center rounded-lg px-4 text-sm font-medium text-[var(--muted)] underline-offset-4 hover:text-[var(--accent)] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Résumé
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
