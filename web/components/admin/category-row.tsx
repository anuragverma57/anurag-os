"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CategoryRow({
  slug,
  initialName,
  initialSortOrder,
}: {
  slug: string;
  initialName: string;
  initialSortOrder: number;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [sortOrder, setSortOrder] = useState(String(initialSortOrder));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setPending(true);
    setError(null);
    try {
      const so = Number.parseInt(sortOrder, 10);
      const res = await fetch(`/api/admin/note-categories/${encodeURIComponent(slug)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          sortOrder: Number.isFinite(so) ? so : 0,
        }),
      });
      if (!res.ok) {
        const d = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(d.error ?? "Save failed");
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setPending(false);
    }
  }

  async function remove() {
    if (!window.confirm(`Delete category “${slug}”? Only allowed if no notes use it.`)) {
      return;
    }
    setPending(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/note-categories/${encodeURIComponent(slug)}`,
        { method: "DELETE" },
      );
      if (!res.ok) {
        const d = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(d.error ?? "Delete failed");
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <tr className="border-b border-[var(--border)] last:border-0">
      <td className="px-4 py-3 font-mono text-xs text-[var(--muted)]">{slug}</td>
      <td className="px-4 py-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full min-w-[140px] rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-sm text-[var(--text)]"
        />
      </td>
      <td className="px-4 py-3">
        <input
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="w-20 rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-sm text-[var(--text)]"
        />
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex justify-end gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={() => void save()}
            className="text-sm font-medium text-[var(--accent)] hover:underline disabled:opacity-50"
          >
            Save
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => void remove()}
            className="text-sm font-medium text-red-400 hover:underline disabled:opacity-50"
          >
            Delete
          </button>
        </div>
        {error ? <p className="mt-2 text-xs text-red-400">{error}</p> : null}
      </td>
    </tr>
  );
}
