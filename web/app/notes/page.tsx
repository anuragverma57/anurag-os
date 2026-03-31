import Link from "next/link";
import {
  listNoteCategoriesPublic,
  listPublicNotes,
} from "@/lib/notes/server";
import type { NoteRecord } from "@/lib/types/note";

export const dynamic = "force-dynamic";

function formatDate(ms: number): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(ms));
}

export default async function PublicNotesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: categoryParam } = await searchParams;
  const categorySlug =
    typeof categoryParam === "string" && categoryParam.trim()
      ? categoryParam.trim()
      : undefined;

  let notes: NoteRecord[] = [];
  let categories: Awaited<ReturnType<typeof listNoteCategoriesPublic>> = [];
  let loadError: string | null = null;

  try {
    [notes, categories] = await Promise.all([
      listPublicNotes(
        categorySlug ? { categorySlug } : undefined,
      ),
      listNoteCategoriesPublic(),
    ]);
  } catch (e) {
    loadError = e instanceof Error ? e.message : String(e);
  }

  const categoryLabel = (slug: string) =>
    categories.find((c) => c.slug === slug)?.name ?? slug;

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16 sm:py-20">
      <div className="mb-12 max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
          Notes
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
          Learning notes
        </h1>
        <p className="mt-4 text-[var(--muted)]">
          Public prep notes—DSA, system design, backend, and more. Private drafts stay in
          admin only.
        </p>
      </div>

      {loadError ? (
        <div
          className="rounded-xl border border-amber-500/35 bg-amber-500/10 p-6 text-sm text-amber-100"
          role="alert"
        >
          <p className="font-semibold">Could not load notes.</p>
          <p className="mt-2 font-mono text-xs text-[var(--muted)]">{loadError}</p>
          <p className="mt-4 text-[var(--text)]">
            If this mentions an index, deploy{" "}
            <code className="rounded bg-[var(--surface-2)] px-1">firestore.indexes.json</code>{" "}
            or open the link in the Firebase console error to create the composite index.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-10 flex flex-wrap gap-2">
            <FilterChip
              href="/notes"
              active={!categorySlug}
              label="All"
            />
            {categories.map((c) => (
              <FilterChip
                key={c.slug}
                href={`/notes?category=${encodeURIComponent(c.slug)}`}
                active={categorySlug === c.slug}
                label={c.name}
              />
            ))}
          </div>

          {notes.length === 0 ? (
            <p className="text-[var(--muted)]">
              No public notes yet{categorySlug ? ` in ${categoryLabel(categorySlug)}` : ""}.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {notes.map((n) => (
                <li key={n.id}>
                  <Link
                    href={`/notes/${encodeURIComponent(n.slug)}`}
                    className="group block rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-colors hover:border-[color-mix(in_oklab,var(--accent)_35%,var(--border))]"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                      <span className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-2 py-0.5 font-medium text-[var(--text)]">
                        {categoryLabel(n.categorySlug)}
                      </span>
                      <span>{formatDate(n.updatedAtMs)}</span>
                    </div>
                    <h2 className="mt-3 font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--text)] group-hover:text-[var(--accent)]">
                      {n.title}
                    </h2>
                    {n.excerpt ? (
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--muted)]">
                        {n.excerpt}
                      </p>
                    ) : null}
                    {n.tags.length > 0 ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {n.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-md bg-[var(--surface-2)] px-2 py-0.5 text-xs text-[var(--muted)]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}

function FilterChip({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_12%,transparent)] text-[var(--text)]"
          : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--text)]"
      }`}
    >
      {label}
    </Link>
  );
}
