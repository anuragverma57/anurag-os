import { ProgressTopicForm } from "@/components/admin/progress-topic-form";
import { listNoteCategoriesAdmin } from "@/lib/notes/server";

export const dynamic = "force-dynamic";

export default async function NewProgressTopicPage() {
  const categories = await listNoteCategoriesAdmin().catch(() => []);

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
        Add progress topic
      </h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Categories match your note categories (DSA, system design, backend, …).
      </p>
      <div className="mt-8">
        <ProgressTopicForm mode="create" categories={categories} />
      </div>
    </div>
  );
}
