import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/project-form";
import { getProjectByIdAdmin } from "@/lib/projects/server";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditProjectPage({ params }: PageProps) {
  const { id } = await params;
  const project = await getProjectByIdAdmin(id);
  if (!project) notFound();

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
        Edit project
      </h1>
      <p className="mt-2 text-sm text-[var(--muted)]">{project.title}</p>
      <div className="mt-8">
        <ProjectForm mode="edit" initial={project} />
      </div>
    </div>
  );
}
