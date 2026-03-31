import Link from "next/link";
import type { SitePublic } from "@/lib/types/site-settings";

export function Footer({ site }: { site: SitePublic }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[var(--border)] py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <p className="text-sm text-[var(--muted)]">
          © {year} {site.name}. Built with Next.js.
        </p>
        <div className="flex gap-6 text-sm">
          <a
            href={site.github}
            className="text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href={site.linkedin}
            className="text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <Link
            href="/admin"
            className="text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
