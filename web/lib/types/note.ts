/**
 * Notes domain (Phase 3).
 *
 * Firestore layout (intentional):
 * - `note_categories/{slug}` — category is keyed by immutable `slug` (document ID).
 *   Notes reference `categorySlug`; renames only touch `name` / `sortOrder`.
 * - `notes/{noteId}` — auto IDs; `slug` is unique for public URLs; `contentMarkdown` is source of truth.
 */

export type NoteCategoryRecord = {
  slug: string;
  name: string;
  sortOrder: number;
};

export type NoteCategoryInput = {
  slug: string;
  name: string;
  sortOrder: number;
};

/** Public + admin list/detail (with id). */
export type NoteRecord = {
  id: string;
  title: string;
  /** URL segment; globally unique among notes. */
  slug: string;
  contentMarkdown: string;
  /** Card / list preview; optional — can be derived when empty. */
  excerpt: string | null;
  /** Matches `note_categories` document ID. */
  categorySlug: string;
  tags: string[];
  isPublic: boolean;
  createdAtMs: number;
  updatedAtMs: number;
};

export type NoteInput = {
  title: string;
  slug: string;
  contentMarkdown: string;
  excerpt: string | null;
  categorySlug: string;
  tags: string[];
  isPublic: boolean;
};
