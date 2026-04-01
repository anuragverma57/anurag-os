/**
 * Phase 4 — preparation progress per topic, grouped by note category slug.
 */

export const PROGRESS_STATUSES = [
  "not_started",
  "in_progress",
  "completed",
  "needs_revision",
] as const;

export type ProgressStatus = (typeof PROGRESS_STATUSES)[number];

export type ProgressTopicRecord = {
  id: string;
  title: string;
  /** Aligns with `note_categories` document IDs (e.g. dsa, backend). */
  categorySlug: string;
  status: ProgressStatus;
  /** 1–5, or null when not set. */
  confidence: number | null;
  /** Short admin-only context (not a full note). */
  detailNotes: string | null;
  sortOrder: number;
  createdAtMs: number;
  updatedAtMs: number;
};

export type ProgressTopicInput = {
  title: string;
  categorySlug: string;
  status: ProgressStatus;
  confidence: number | null;
  detailNotes: string | null;
  sortOrder: number;
};
