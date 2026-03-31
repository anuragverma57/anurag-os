/**
 * Collection names are prefixed to avoid collisions with other app data in the same project.
 */
export const NOTE_CATEGORIES_COLLECTION = "note_categories";
export const NOTES_COLLECTION = "notes";

/** Default categories seeded when DB is empty (slugs are stable foreign keys). */
export const DEFAULT_NOTE_CATEGORY_SEED: readonly {
  slug: string;
  name: string;
  sortOrder: number;
}[] = [
  { slug: "dsa", name: "DSA", sortOrder: 0 },
  { slug: "system-design", name: "System design", sortOrder: 1 },
  { slug: "backend", name: "Backend", sortOrder: 2 },
  { slug: "devops", name: "DevOps", sortOrder: 3 },
  { slug: "other", name: "Other", sortOrder: 4 },
] as const;
