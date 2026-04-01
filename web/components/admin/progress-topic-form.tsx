"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PROGRESS_STATUS_LABELS } from "@/lib/progress/constants";
import type { NoteCategoryRecord } from "@/lib/types/note";
import type { ProgressTopicRecord, ProgressStatus } from "@/lib/types/progress";
import { PROGRESS_STATUSES } from "@/lib/types/progress";

type Mode = "create" | "edit";

export function ProgressTopicForm({
  mode,
  initial,
  categories,
}: {
  mode: Mode;
  initial?: ProgressTopicRecord | null;
  categories: NoteCategoryRecord[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [categorySlug, setCategorySlug] = useState(
    initial?.categorySlug ?? categories[0]?.slug ?? "other",
  );
  const [status, setStatus] = useState<ProgressStatus>(
    initial?.status ?? "not_started",
  );
  const [confidence, setConfidence] = useState<string>(
    initial?.confidence != null ? String(initial.confidence) : "",
  );
  const [detailNotes, setDetailNotes] = useState(initial?.detailNotes ?? "");
  const [sortOrder, setSortOrder] = useState(
    String(initial?.sortOrder ?? 0),
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const so = Number.parseInt(sortOrder, 10);
    const confNum = confidence.trim() === "" ? null : Number.parseInt(confidence, 10);
    const confidencePayload =
      confNum !== null && Number.isFinite(confNum) && confNum >= 1 && confNum <= 5
        ? confNum
        : null;

    const payload = {
      title: title.trim(),
      categorySlug,
      status,
      confidence: confidencePayload,
      detailNotes: detailNotes.trim() ? detailNotes.trim() : null,
      sortOrder: Number.isFinite(so) ? so : 0,
    };

    setPending(true);
    try {
      if (mode === "create") {
        const res = await fetch("/api/admin/progress-topics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const d = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(d.error ?? "Save failed");
        }
      } else if (initial) {
        const res = await fetch(`/api/admin/progress-topics/${initial.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const d = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(d.error ?? "Save failed");
        }
      }
      router.push("/admin/progress");
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
          Topic title
        </label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Binary search patterns"
          className="mt-1.5 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--text)] outline-none ring-[var(--accent)]/30 focus:ring-2"
        />
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
            Add note categories first under Notes → Categories.
          </p>
        ) : null}
      </div>
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
          Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ProgressStatus)}
          className="mt-1.5 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--text)] outline-none ring-[var(--accent)]/30 focus:ring-2"
        >
          {PROGRESS_STATUSES.map((s) => (
            <option key={s} value={s}>
              {PROGRESS_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
          Confidence (1–5, optional)
        </label>
        <select
          value={confidence}
          onChange={(e) => setConfidence(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--text)] outline-none ring-[var(--accent)]/30 focus:ring-2"
        >
          <option value="">—</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={String(n)}>
              {n}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
          Notes (optional)
        </label>
        <textarea
          rows={4}
          value={detailNotes}
          onChange={(e) => setDetailNotes(e.target.value)}
          placeholder="Short context: resources, weak spots, next steps…"
          className="mt-1.5 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--text)] outline-none ring-[var(--accent)]/30 focus:ring-2"
        />
      </div>
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
          Sort order (within category)
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
          {pending ? "Saving…" : mode === "create" ? "Add topic" : "Save"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/progress")}
          className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--muted)] hover:text-[var(--text)]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
