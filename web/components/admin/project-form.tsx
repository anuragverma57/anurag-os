"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ProjectRecord } from "@/lib/types/project";

type Mode = "create" | "edit";

export function ProjectForm({
  mode,
  initial,
}: {
  mode: Mode;
  initial?: ProjectRecord | null;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [href, setHref] = useState(initial?.href ?? "");
  const [stack, setStack] = useState(initial?.stack.join(", ") ?? "");
  const [repo, setRepo] = useState(initial?.repo ?? "");
  const [linkLabel, setLinkLabel] = useState(initial?.linkLabel ?? "");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [isPublic, setIsPublic] = useState(initial?.isPublic ?? true);
  const [sortOrder, setSortOrder] = useState(
    String(initial?.sortOrder ?? 0),
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const stackArr = stack
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const so = Number.parseInt(sortOrder, 10);
    const payload = {
      title: title.trim(),
      description: description.trim(),
      href: href.trim(),
      stack: stackArr,
      repo: repo.trim() || null,
      linkLabel: linkLabel.trim() || null,
      featured,
      isPublic,
      sortOrder: Number.isFinite(so) ? so : 0,
    };

    try {
      if (mode === "create") {
        const res = await fetch("/api/admin/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const d = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(d.error ?? "Save failed");
        }
      } else if (initial) {
        const res = await fetch(`/api/admin/projects/${initial.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const d = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(d.error ?? "Save failed");
        }
      }
      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="max-w-xl space-y-5">
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
          Description
        </label>
        <textarea
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--text)] outline-none ring-[var(--accent)]/30 focus:ring-2"
        />
      </div>
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
          Primary link (URL or path)
        </label>
        <input
          required
          value={href}
          onChange={(e) => setHref(e.target.value)}
          placeholder="https://… or /resume.pdf"
          className="mt-1.5 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--text)] outline-none ring-[var(--accent)]/30 focus:ring-2"
        />
      </div>
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
          Stack (comma-separated)
        </label>
        <input
          value={stack}
          onChange={(e) => setStack(e.target.value)}
          placeholder="Next.js, TypeScript, Go"
          className="mt-1.5 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--text)] outline-none ring-[var(--accent)]/30 focus:ring-2"
        />
      </div>
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
          Repo URL (optional)
        </label>
        <input
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--text)] outline-none ring-[var(--accent)]/30 focus:ring-2"
        />
      </div>
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
          Link label (optional)
        </label>
        <input
          value={linkLabel}
          onChange={(e) => setLinkLabel(e.target.value)}
          placeholder="Repository"
          className="mt-1.5 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--text)] outline-none ring-[var(--accent)]/30 focus:ring-2"
        />
      </div>
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-[var(--text)]">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="rounded border-[var(--border)]"
          />
          Featured layout
        </label>
        <label className="flex items-center gap-2 text-sm text-[var(--text)]">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="rounded border-[var(--border)]"
          />
          Public on portfolio
        </label>
      </div>
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
          Sort order
        </label>
        <input
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="mt-1.5 w-32 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--text)] outline-none ring-[var(--accent)]/30 focus:ring-2"
        />
      </div>
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
          onClick={() => router.push("/admin/projects")}
          className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--muted)] hover:text-[var(--text)]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
