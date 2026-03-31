"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { NoteCategoryRecord, NoteRecord } from "@/lib/types/note";
import { isValidSlug, slugifyTitle } from "@/lib/notes/slug";

type Mode = "create" | "edit";

export function NoteForm({
  mode,
  initial,
  categories,
}: {
  mode: Mode;
  initial?: NoteRecord | null;
  categories: NoteCategoryRecord[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [contentMarkdown, setContentMarkdown] = useState(
    initial?.contentMarkdown ?? "",
  );
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [categorySlug, setCategorySlug] = useState(
    initial?.categorySlug ?? categories[0]?.slug ?? "other",
  );
  const [tags, setTags] = useState(initial?.tags.join(", ") ?? "");
  const [isPublic, setIsPublic] = useState(initial?.isPublic ?? true);

  useEffect(() => {
    if (slugTouched) return;
    const next = slugifyTitle(title);
    setSlug(next);
  }, [title, slugTouched]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const slugTrim = slug.trim();
    if (!isValidSlug(slugTrim)) {
      setError(
        "Slug must be lowercase letters, numbers, and hyphens only (e.g. my-note-title).",
      );
      return;
    }

    const tagsArr = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    setPending(true);
    const payload = {
      title: title.trim(),
      slug: slugTrim,
      contentMarkdown,
      excerpt: excerpt.trim() ? excerpt.trim() : null,
      categorySlug,
      tags: tagsArr,
      isPublic,
    };

    try {
      if (mode === "create") {
        const res = await fetch("/api/admin/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const d = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(d.error ?? "Save failed");
        }
      } else if (initial) {
        const res = await fetch(`/api/admin/notes/${initial.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const d = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(d.error ?? "Save failed");
        }
      }
      router.push("/admin/notes");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="max-w-2xl space-y-5">
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
          Title
        </label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--text)] outline-none ring-[var(--accent)]/30 focus:ring-2"
        />
      </div>
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
          URL slug
        </label>
        <input
          required
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          className="mt-1.5 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-mono text-sm text-[var(--text)] outline-none ring-[var(--accent)]/30 focus:ring-2"
        />
        <p className="mt-1 text-xs text-[var(--muted)]">
          Public URL: /notes/{slug || "…"}. Auto-filled from title until you edit it.
        </p>
      </div>
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
          Category
        </label>
        <select
          value={categorySlug}
          onChange={(e) => setCategorySlug(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--text)] outline-none ring-[var(--accent)]/30 focus:ring-2"
        >
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        {categories.length === 0 ? (
          <p className="mt-2 text-sm text-amber-400">
            No categories yet. Seed defaults under{" "}
            <a href="/admin/notes/categories" className="underline">
              Categories
            </a>
            .
          </p>
        ) : null}
      </div>
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
          Tags (comma-separated)
        </label>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="redis, caching, go"
          className="mt-1.5 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--text)] outline-none ring-[var(--accent)]/30 focus:ring-2"
        />
      </div>
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
          Excerpt (optional — list preview; left empty, generated from body)
        </label>
        <textarea
          rows={2}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--text)] outline-none ring-[var(--accent)]/30 focus:ring-2"
        />
      </div>
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
          Content (Markdown)
        </label>
        <textarea
          required
          rows={18}
          value={contentMarkdown}
          onChange={(e) => setContentMarkdown(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-mono text-sm leading-relaxed text-[var(--text)] outline-none ring-[var(--accent)]/30 focus:ring-2"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-[var(--text)]">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="rounded border-[var(--border)]"
        />
        Public on /notes
      </label>
      {error ? (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--accent-fg)] disabled:opacity-60"
        >
          {pending ? "Saving…" : mode === "create" ? "Create" : "Save"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/notes")}
          className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--muted)] hover:text-[var(--text)]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
