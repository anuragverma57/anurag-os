import { notFound } from "next/navigation";
import { NoteForm } from "@/components/admin/note-form";
import {
  getNoteByIdAdmin,
  listNoteCategoriesAdmin,
} from "@/lib/notes/server";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditNotePage(props: Props) {
  const { id } = await props.params;
  const [note, categories] = await Promise.all([
    getNoteByIdAdmin(id),
    listNoteCategoriesAdmin().catch(() => []),
  ]);
  if (!note) notFound();

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
        Edit note
      </h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Changing the slug updates the public URL; old links will break unless you add redirects
        later.
      </p>
      <div className="mt-8">
        <NoteForm mode="edit" initial={note} categories={categories} />
      </div>
    </div>
  );
}
