import type { SitePublic } from "@/lib/types/site-settings";

export function Contact({
  site,
  copy,
}: {
  site: SitePublic;
  copy: { title: string; body: string };
}) {
  return (
    <section id="contact" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="rounded-3xl border border-[var(--border)] bg-[linear-gradient(145deg,var(--surface)_0%,var(--surface-2)_100%)] p-8 sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            Contact
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
            {copy.title}
          </h2>
          <p className="mt-4 max-w-xl text-[var(--muted)]">{copy.body}</p>
          <a
            href={`mailto:${site.email}`}
            className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-[var(--accent)] px-8 text-sm font-semibold text-[var(--accent-fg)] transition-opacity hover:opacity-90"
          >
            {site.email}
          </a>
          <div className="mt-8 flex flex-wrap gap-6 text-sm">
            <a
              href={site.github}
              className="font-medium text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub →
            </a>
            <a
              href={site.linkedin}
              className="font-medium text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
