import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MarkdownRenderer } from "@/components/notes/markdown-renderer";
import {
  listNoteCategoriesPublic,
  getPublicNoteBySlug,
} from "@/lib/notes/server";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const note = await getPublicNoteBySlug(decodeURIComponent(slug));
  if (!note) return { title: "Note" };
  return {
    title: note.title,
    description: note.excerpt ?? undefined,
  };
}

function formatDate(ms: number): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(ms));
}

export default async function PublicNoteDetailPage(props: Props) {
  const { slug: raw } = await props.params;
  const slug = decodeURIComponent(raw);
  const [note, categories] = await Promise.all([
    getPublicNoteBySlug(slug),
    listNoteCategoriesPublic(),
  ]);
  if (!note) notFound();

  const categoryLabel =
    categories.find((c) => c.slug === note.categorySlug)?.name ??
    note.categorySlug;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 sm:py-20">
      <p className="text-sm text-[var(--muted)]">
        <Link href="/notes" className="text-[var(--accent)] hover:underline">
          ← All notes
        </Link>
      </p>
      <article className="mt-8">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
          <span className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 font-medium text-[var(--text)]">
            {categoryLabel}
          </span>
          <span>Updated {formatDate(note.updatedAtMs)}</span>
        </div>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
          {note.title}
        </h1>
        {note.tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {note.tags.map((t) => (
              <span
                key={t}
                className="rounded-md bg-[var(--surface-2)] px-2 py-0.5 text-xs text-[var(--muted)]"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}
        <div className="mt-10 border-t border-[var(--border)] pt-10">
          <MarkdownRenderer content={note.contentMarkdown} />
        </div>
      </article>
    </main>
  );
}
