import Link from "next/link";
import { DeleteProjectButton } from "@/components/admin/delete-project-button";
import { SeedProjectsButton } from "@/components/admin/seed-projects-button";
import { getAllProjectsAdmin } from "@/lib/projects/server";
import type { ProjectRecord } from "@/lib/types/project";

export const dynamic = "force-dynamic";

function isFirestoreNotReadyMessage(msg: string): boolean {
  return (
    msg.includes("PERMISSION_DENIED") ||
    msg.includes("firestore.googleapis.com") ||
    msg.includes("Cloud Firestore API has not been used")
  );
}

export default async function AdminProjectsPage() {
  let projects: ProjectRecord[] = [];
  let loadError: string | null = null;

  try {
    projects = await getAllProjectsAdmin();
  } catch (e) {
    loadError = e instanceof Error ? e.message : String(e);
  }

  if (loadError) {
    const apiConsole =
      "https://console.developers.google.com/apis/library/firestore.googleapis.com";
    return (
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
          Projects
        </h1>
        <div
          className="mt-6 max-w-2xl rounded-xl border border-amber-500/35 bg-amber-500/10 p-6 text-sm"
          role="alert"
        >
          <p className="font-semibold text-amber-100">
            {isFirestoreNotReadyMessage(loadError)
              ? "Firestore isn’t enabled for this Firebase / Google Cloud project yet."
              : "Could not load projects from Firestore."}
          </p>
          <p className="mt-3 font-mono text-xs leading-relaxed text-[var(--muted)]">
            {loadError}
          </p>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-[var(--text)]">
            <li>
              Firebase Console → <strong>Build</strong> →{" "}
              <strong>Firestore Database</strong> → <strong>Create database</strong> (choose a
              mode and region).
            </li>
            <li>
              Google Cloud Console → <strong>APIs &amp; Services</strong> → enable the{" "}
              <strong>Cloud Firestore API</strong> if prompted (
              <a
                href={apiConsole}
                className="text-[var(--accent)] underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                open API library
              </a>
              ).
            </li>
            <li>Wait 1–2 minutes after enabling, then refresh this page.</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
          Projects
        </h1>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center justify-center rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-fg)] hover:opacity-90"
        >
          New project
        </Link>
      </div>
      <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
        Only projects with <strong className="text-[var(--text)]">Public on portfolio</strong> appear on
        the homepage. Use sort order (lower first) within featured vs non-featured groups.
      </p>
      <div className="mt-6">
        <SeedProjectsButton />
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-[var(--muted)]">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Public</th>
              <th className="px-4 py-3 font-medium">Featured</th>
              <th className="px-4 py-3 font-medium">Sort</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[var(--muted)]">
                  No projects yet. Add one or seed defaults.
                </td>
              </tr>
            ) : (
              projects.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-[var(--border)] last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-[var(--text)]">
                    {p.title}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {p.isPublic ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {p.featured ? "Yes" : "—"}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">{p.sortOrder}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-4">
                      <Link
                        href={`/admin/projects/${p.id}/edit`}
                        className="font-medium text-[var(--accent)] hover:underline"
                      >
                        Edit
                      </Link>
                      <DeleteProjectButton id={p.id} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
