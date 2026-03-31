"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { isValidSlug, slugifyTitle } from "@/lib/notes/slug";

export function CategoryCreateForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [sortOrder, setSortOrder] = useState("99");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function syncSlugFromName(n: string) {
    if (slugTouched) return;
    setSlug(slugifyTitle(n));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const s = slug.trim();
    if (!isValidSlug(s)) {
      setError("Invalid slug (lowercase, numbers, hyphens).");
      return;
    }
    setPending(true);
    try {
      const so = Number.parseInt(sortOrder, 10);
      const res = await fetch("/api/admin/note-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: s,
          name: name.trim(),
          sortOrder: Number.isFinite(so) ? so : 99,
        }),
      });
      if (!res.ok) {
        const d = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(d.error ?? "Create failed");
      }
      setName("");
      setSlug("");
      setSlugTouched(false);
      setSortOrder("99");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={(e) => void onSubmit(e)}
      className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
    >
      <p className="text-sm font-medium text-[var(--text)]">Add category</p>
      <p className="mt-1 text-xs text-[var(--muted)]">
        Slug is the stable ID stored on notes; pick it once.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div>
          <label className="text-xs text-[var(--muted)]">Name</label>
          <input
            required
            value={name}
            onChange={(e) => {
              const v = e.target.value;
              setName(v);
              syncSlugFromName(v);
            }}
            className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-[var(--muted)]">Slug</label>
          <input
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-[var(--muted)]">Sort order</label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm"
          />
        </div>
      </div>
      {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-fg)] disabled:opacity-50"
      >
        {pending ? "Adding…" : "Add category"}
      </button>
    </form>
  );
}
