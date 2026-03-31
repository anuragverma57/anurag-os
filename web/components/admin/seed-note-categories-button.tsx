"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SeedNoteCategoriesButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSeed() {
    setPending(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/seed-note-categories", {
        method: "POST",
      });
      const data = (await res.json()) as { inserted?: number; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Seed failed");
      setMessage(
        data.inserted
          ? `Created ${data.inserted} categories.`
          : "Categories already exist.",
      );
      router.refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Seed failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        disabled={pending}
        onClick={() => void onSeed()}
        className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)] hover:border-[var(--accent)] disabled:opacity-50"
      >
        {pending ? "Seeding…" : "Seed default categories"}
      </button>
      {message ? (
        <span className="text-sm text-[var(--muted)]">{message}</span>
      ) : null}
    </div>
  );
}
