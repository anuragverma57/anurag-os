import { NoteForm } from "@/components/admin/note-form";
import { listNoteCategoriesAdmin } from "@/lib/notes/server";

export const dynamic = "force-dynamic";

export default async function NewNotePage() {
  let categories = await listNoteCategoriesAdmin().catch(() => []);

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
        New note
      </h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Write in Markdown. Slug becomes the public URL under{" "}
        <code className="rounded bg-[var(--surface-2)] px-1">/notes/&lt;slug&gt;</code>.
      </p>
      <div className="mt-8">
        <NoteForm mode="create" categories={categories} />
      </div>
    </div>
  );
}
