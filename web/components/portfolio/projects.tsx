import type { ProjectRecord } from "@/lib/types/project";

function ProjectCard({
  project,
  featured,
}: {
  project: ProjectRecord;
  featured?: boolean;
}) {
  return (
    <article
      className={`group flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--accent)_35%,var(--border))] hover:shadow-[0_24px_48px_-28px_color-mix(in_oklab,var(--accent)_22%,transparent)] ${
        featured
          ? "p-8 lg:flex-row lg:items-stretch lg:gap-12 lg:p-10"
          : "p-6"
      }`}
    >
      <div className={featured ? "flex flex-1 flex-col lg:justify-center" : "flex flex-col"}>
        {featured ? (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            Featured
          </p>
        ) : null}
        <h3
          className={`font-[family-name:var(--font-display)] font-semibold text-[var(--text)] ${
            featured ? "mt-3 text-2xl sm:text-3xl" : "text-xl"
          }`}
        >
          {project.title}
        </h3>
        <p
          className={`mt-3 flex-1 leading-relaxed text-[var(--muted)] ${
            featured ? "max-w-2xl text-base" : "text-sm"
          }`}
        >
          {project.description}
        </p>
        <div className={`mt-5 flex flex-wrap gap-2 ${featured ? "mt-6" : ""}`}>
          {project.stack.map((s) => (
            <span
              key={s}
              className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-2 py-0.5 text-xs font-medium text-[var(--muted)]"
            >
              {s}
            </span>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-4 text-sm font-medium">
          <a
            href={project.href}
            className="inline-flex items-center gap-1 text-[var(--text)] underline-offset-4 transition-colors hover:text-[var(--accent)] hover:underline"
            target={project.href.startsWith("/") ? undefined : "_blank"}
            rel={
              project.href.startsWith("/")
                ? undefined
                : "noopener noreferrer"
            }
          >
            {project.linkLabel ?? "Open"}
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </a>
          {project.repo && project.repo !== project.href ? (
            <a
              href={project.repo}
              className="text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
              target="_blank"
              rel="noopener noreferrer"
            >
              Source
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function Projects({
  projects,
  githubUrl,
  copy,
}: {
  projects: ProjectRecord[];
  githubUrl: string;
  copy: { title: string; subtitle: string };
}) {
  const featuredList = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section
      id="projects"
      className="scroll-mt-20 border-b border-[var(--border)] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-12 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            Work
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
            {copy.title}
          </h2>
          <p className="mt-4 text-[var(--muted)]">
            {copy.subtitle}{" "}
            <a
              href={githubUrl}
              className="font-medium text-[var(--text)] underline-offset-4 hover:text-[var(--accent)] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            .
          </p>
        </div>

        {projects.length === 0 ? (
          <p className="text-[var(--muted)]">No public projects yet.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {featuredList.map((project) => (
              <ProjectCard key={project.id} project={project} featured />
            ))}
            <ul className="grid gap-6 md:grid-cols-2">
              {rest.map((project) => (
                <li key={project.id}>
                  <ProjectCard project={project} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
