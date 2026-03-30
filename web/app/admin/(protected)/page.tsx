export const dynamic = "force-dynamic";

export default function AdminHomePage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
        Dashboard
      </h1>
      <p className="mt-3 text-[var(--muted)]">
        Phase 1 is live: you are authenticated as the single admin. Later phases
        will add notes, progress, tasks, and interviews here.
      </p>
      <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="text-sm font-medium text-[var(--text)]">Visibility model</p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
          Public pages only show content with{" "}
          <code className="rounded bg-[var(--surface-2)] px-1.5 py-0.5 text-[var(--text)]">
            isPublic === true
          </code>
          . Admin tools will enforce this when CRUD lands.
        </p>
      </div>
    </div>
  );
}
