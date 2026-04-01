import Link from "next/link";
import { DeleteProgressTopicButton } from "@/components/admin/delete-progress-topic-button";
import { PROGRESS_STATUS_LABELS } from "@/lib/progress/constants";
import { listProgressTopicsAdmin } from "@/lib/progress/server";
import { listNoteCategoriesAdmin } from "@/lib/notes/server";
import type { ProgressTopicRecord } from "@/lib/types/progress";

export const dynamic = "force-dynamic";

function formatDate(ms: number): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(ms));
}

function groupByCategory(
  topics: ProgressTopicRecord[],
  categoryNames: Map<string, string>,
): { slug: string; label: string; items: ProgressTopicRecord[] }[] {
  const map = new Map<string, ProgressTopicRecord[]>();
  for (const t of topics) {
    const list = map.get(t.categorySlug) ?? [];
    list.push(t);
    map.set(t.categorySlug, list);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([slug, items]) => ({
      slug,
      label: categoryNames.get(slug) ?? slug,
      items,
    }));
}

export default async function AdminProgressPage() {
  let topics: ProgressTopicRecord[] = [];
  let categories = await listNoteCategoriesAdmin().catch(() => []);
  let loadError: string | null = null;

  try {
    topics = await listProgressTopicsAdmin();
  } catch (e) {
    loadError = e instanceof Error ? e.message : String(e);
  }

  const categoryNames = new Map(categories.map((c) => [c.slug, c.name]));

  if (loadError) {
    return (
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
          Progress
        </h1>
        <p className="mt-3 font-mono text-sm text-red-400">{loadError}</p>
      </div>
    );
  }

  const grouped = groupByCategory(topics, categoryNames);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
          Progress tracker
        </h1>
        <Link
          href="/admin/progress/new"
          className="inline-flex items-center justify-center rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-fg)] hover:opacity-90"
        >
          Add topic
        </Link>
      </div>
      <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
        Track preparation by topic (aligned with your note categories). Status and
        confidence are admin-only until you choose to surface a public summary in a
        later phase.
      </p>

      {topics.length === 0 ? (
        <p className="mt-10 text-[var(--muted)]">
          No topics yet. Add one, or seed note categories under Notes if the category
          list is empty.
        </p>
      ) : (
        <div className="mt-10 space-y-10">
          {grouped.map((group) => (
            <section key={group.slug}>
              <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-[var(--accent)]">
                {group.label}
              </h2>
              <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-[var(--muted)]">
                      <th className="px-4 py-3 font-medium">Topic</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Confidence</th>
                      <th className="px-4 py-3 font-medium">Updated</th>
                      <th className="px-4 py-3 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.items.map((t) => (
                      <tr
                        key={t.id}
                        className="border-b border-[var(--border)] last:border-0"
                      >
                        <td className="px-4 py-3">
                          <div className="font-medium text-[var(--text)]">{t.title}</div>
                          {t.detailNotes ? (
                            <p className="mt-1 line-clamp-2 text-xs text-[var(--muted)]">
                              {t.detailNotes}
                            </p>
                          ) : null}
                        </td>
                        <td className="px-4 py-3 text-[var(--muted)]">
                          {PROGRESS_STATUS_LABELS[t.status]}
                        </td>
                        <td className="px-4 py-3 text-[var(--muted)]">
                          {t.confidence ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-[var(--muted)]">
                          {formatDate(t.updatedAtMs)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-4">
                            <Link
                              href={`/admin/progress/${t.id}/edit`}
                              className="font-medium text-[var(--accent)] hover:underline"
                            >
                              Edit
                            </Link>
                            <DeleteProgressTopicButton id={t.id} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
