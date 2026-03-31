import { ProjectForm } from "@/components/admin/project-form";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
        New project
      </h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Create a project. Uncheck &quot;Public on portfolio&quot; to keep it admin-only.
      </p>
      <div className="mt-8">
        <ProjectForm mode="create" />
      </div>
    </div>
  );
}
