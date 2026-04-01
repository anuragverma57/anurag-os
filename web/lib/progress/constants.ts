import type { ProgressStatus } from "@/lib/types/progress";

export const PROGRESS_TOPICS_COLLECTION = "progress_topics";

export const PROGRESS_STATUS_LABELS: Record<ProgressStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  completed: "Completed",
  needs_revision: "Needs revision",
};
