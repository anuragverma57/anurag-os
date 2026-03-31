import Link from "next/link";
import { DeleteNoteButton } from "@/components/admin/delete-note-button";
import { SeedNoteCategoriesButton } from "@/components/admin/seed-note-categories-button";
import { listNotesAdmin } from "@/lib/notes/server";
import type { NoteRecord } from "@/lib/types/note";

export const dynamic = "force-dynamic";

function isFirestoreOrIndexMessage(msg: string): boolean {
  return (
    msg.includes("PERMISSION_DENIED") ||
    msg.includes("firestore.googleapis.com") ||
    msg.includes("FAILED_PRECONDITION") ||
    msg.includes("index")
  );
}

function formatDate(ms: number): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(ms));
}

export default async function AdminNotesPage() {
  let notes: NoteRecord[] = [];
  let loadError: string | null = null;

  try {
    notes = await listNotesAdmin();
  } catch (e) {
    loadError = e instanceof Error ? e.message : String(e);
  }

  if (loadError) {
    return (
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
          Notes
        </h1>
        <div
          className="mt-6 max-w-2xl rounded-xl border border-amber-500/35 bg-amber-500/10 p-6 text-sm"
          role="alert"
        >
          <p className="font-semibold text-amber-100">
            {isFirestoreOrIndexMessage(loadError)
              ? "Firestore or an index may be missing."
              : "Could not load notes."}
          </p>
          <p className="mt-3 font-mono text-xs leading-relaxed text-[var(--muted)]">
            {loadError}
          </p>
          {isFirestoreOrIndexMessage(loadError) ? (
            <p className="mt-4 text-[var(--text)]">
              Deploy composite indexes from{" "}
              <code className="rounded bg-[var(--surface-2)] px-1">web/firestore.indexes.json</code>{" "}
              or follow the URL in the error to create indexes in Firebase Console.
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
          Notes
        </h1>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/notes/categories"
            className="inline-flex items-center justify-center rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--text)] hover:border-[var(--accent)]"
          >
            Categories
          </Link>
          <Link
            href="/admin/notes/new"
            className="inline-flex items-center justify-center rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-fg)] hover:opacity-90"
          >
            New note
          </Link>
        </div>
      </div>
      <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
        Markdown notes with categories and tags. Only notes marked{" "}
        <strong className="text-[var(--text)]">Public</strong> appear on{" "}
        <Link href="/notes" className="text-[var(--accent)] hover:underline">
          /notes
        </Link>
        .
      </p>
      <div className="mt-6">
        <SeedNoteCategoriesButton />
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-[var(--muted)]">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Public</th>
              <th className="px-4 py-3 font-medium">Updated</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notes.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[var(--muted)]">
                  No notes yet. Create one or seed categories first.
                </td>
              </tr>
            ) : (
              notes.map((n) => (
                <tr
                  key={n.id}
                  className="border-b border-[var(--border)] last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-[var(--text)]">
                    {n.title}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--muted)]">
                    {n.slug}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {n.isPublic ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {formatDate(n.updatedAtMs)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-4">
                      <Link
                        href={`/admin/notes/${n.id}/edit`}
                        className="font-medium text-[var(--accent)] hover:underline"
                      >
                        Edit
                      </Link>
                      <DeleteNoteButton id={n.id} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
