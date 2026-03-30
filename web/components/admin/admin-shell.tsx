"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link
            href="/admin"
            className="text-sm font-semibold text-[var(--text)]"
          >
            Anurag OS · Admin
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-[var(--muted)] sm:inline">{email}</span>
            <Link
              href="/"
              className="text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
            >
              View site
            </Link>
            <button
              type="button"
              onClick={() => void logout()}
              className="rounded-lg border border-[var(--border)] px-3 py-1.5 font-medium text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Log out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">{children}</main>
    </div>
  );
}
