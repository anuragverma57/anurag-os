import Link from "next/link";
import { CategoryCreateForm } from "@/components/admin/category-create-form";
import { CategoryRow } from "@/components/admin/category-row";
import { SeedNoteCategoriesButton } from "@/components/admin/seed-note-categories-button";
import { listNoteCategoriesAdmin } from "@/lib/notes/server";

export const dynamic = "force-dynamic";

export default async function AdminNoteCategoriesPage() {
  let categories = await listNoteCategoriesAdmin().catch(() => []);

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
          Note categories
        </h1>
        <Link
          href="/admin/notes"
          className="text-sm font-medium text-[var(--accent)] hover:underline"
        >
          ← Back to notes
        </Link>
      </div>
      <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
        Categories use the document ID <code className="rounded bg-[var(--surface-2)] px-1">slug</code>{" "}
        as a stable key on each note. Rename the display name anytime; deleting a category is only
        allowed when no notes reference it.
      </p>

      <div className="mt-6">
        <SeedNoteCategoriesButton />
      </div>

      <div className="mt-8">
        <CategoryCreateForm />
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-[var(--muted)]">
              <th className="px-4 py-3 font-medium">Slug (id)</th>
              <th className="px-4 py-3 font-medium">Display name</th>
              <th className="px-4 py-3 font-medium">Sort</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[var(--muted)]">
                  No categories. Seed defaults above or add one.
                </td>
              </tr>
            ) : (
              categories.map((c) => (
                <CategoryRow
                  key={c.slug}
                  slug={c.slug}
                  initialName={c.name}
                  initialSortOrder={c.sortOrder}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
