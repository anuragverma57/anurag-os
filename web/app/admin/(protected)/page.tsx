import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AdminHomePage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
        Dashboard
      </h1>
      <p className="mt-3 text-[var(--muted)]">
        Edit site copy, experience, education, and section order under Site. Manage
        portfolio projects (public vs private) under Projects. Defaults live in{" "}
        <code className="rounded bg-[var(--surface-2)] px-1.5 py-0.5 text-sm">
          lib/site-content.ts
        </code>{" "}
        when Firestore has no settings document yet.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/admin/site"
          className="inline-flex items-center justify-center rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--accent-fg)] hover:opacity-90"
        >
          Site content
        </Link>
        <Link
          href="/admin/projects"
          className="inline-flex items-center justify-center rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--text)] hover:border-[var(--accent)]"
        >
          Projects
        </Link>
        <Link
          href="/admin/notes"
          className="inline-flex items-center justify-center rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--text)] hover:border-[var(--accent)]"
        >
          Notes
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--text)] hover:border-[var(--accent)]"
        >
          View site
        </Link>
      </div>
      <div className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="text-sm font-medium text-[var(--text)]">Visibility</p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
          The homepage project list only loads Firestore documents with{" "}
          <code className="rounded bg-[var(--surface-2)] px-1.5 py-0.5 text-[var(--text)]">
            isPublic === true
          </code>
          . If the database is empty, the site falls back to default projects from
          code until you seed or add rows.
        </p>
      </div>
    </div>
  );
}
