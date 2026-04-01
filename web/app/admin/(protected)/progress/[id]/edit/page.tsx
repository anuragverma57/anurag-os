import { notFound } from "next/navigation";
import { ProgressTopicForm } from "@/components/admin/progress-topic-form";
import { listNoteCategoriesAdmin } from "@/lib/notes/server";
import { getProgressTopicByIdAdmin } from "@/lib/progress/server";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditProgressTopicPage(props: Props) {
  const { id } = await props.params;
  const [topic, categories] = await Promise.all([
    getProgressTopicByIdAdmin(id),
    listNoteCategoriesAdmin().catch(() => []),
  ]);
  if (!topic) notFound();

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
        Edit topic
      </h1>
      <div className="mt-8">
        <ProgressTopicForm
          mode="edit"
          initial={topic}
          categories={categories}
        />
      </div>
    </div>
  );
}
