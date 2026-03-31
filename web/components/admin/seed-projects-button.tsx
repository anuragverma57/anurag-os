"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SeedProjectsButton() {
  const router = useRouter();
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function seed() {
    setMsg(null);
    setPending(true);
    try {
      const res = await fetch("/api/admin/seed-projects", { method: "POST" });
      const data = (await res.json()) as { inserted?: number; error?: string };
      if (!res.ok) {
        setMsg(data.error ?? "Failed");
        return;
      }
      if (data.inserted === 0) {
        setMsg("Projects collection already has data — seed skipped.");
      } else {
        setMsg(`Imported ${data.inserted} default project(s).`);
      }
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      <button
        type="button"
        disabled={pending}
        onClick={() => void seed()}
        className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)] hover:border-[var(--accent)] disabled:opacity-50"
      >
        {pending ? "Working…" : "Seed default projects"}
      </button>
      {msg ? <p className="text-sm text-[var(--muted)]">{msg}</p> : null}
    </div>
  );
}
