import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import type { SectionId, SitePublic } from "@/lib/types/site-settings";

const NAV: Partial<Record<SectionId, { href: string; label: string }>> = {
  about: { href: "#about", label: "About" },
  experience: { href: "#experience", label: "Experience" },
  education: { href: "#education", label: "Education" },
  projects: { href: "#projects", label: "Projects" },
  contact: { href: "#contact", label: "Contact" },
};

export function Header({
  site,
  sectionOrder,
}: {
  site: SitePublic;
  sectionOrder: SectionId[];
}) {
  const navItems = sectionOrder
    .map((id) => NAV[id])
    .filter((x): x is { href: string; label: string } => Boolean(x));

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--bg)_88%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-6 sm:h-16">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--text)]"
        >
          {site.name.split(" ")[0]}
          <span className="text-[var(--muted)]">.</span>
        </Link>
        <div className="flex min-w-0 items-center gap-1 sm:gap-2">
          <nav
            className="flex max-w-[62vw] items-center gap-0 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:max-w-none sm:gap-0.5 [&::-webkit-scrollbar]:hidden"
            aria-label="Primary"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-md px-2 py-2 text-xs font-medium text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text)] sm:text-sm lg:px-3"
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/notes"
              className="shrink-0 rounded-md px-2 py-2 text-xs font-medium text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text)] sm:text-sm lg:px-3"
            >
              Notes
            </Link>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
