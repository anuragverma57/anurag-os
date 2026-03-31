import {
  FieldValue,
  type DocumentData,
  type Timestamp,
} from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import type {
  NoteCategoryInput,
  NoteCategoryRecord,
  NoteInput,
  NoteRecord,
} from "@/lib/types/note";
import {
  DEFAULT_NOTE_CATEGORY_SEED,
  NOTE_CATEGORIES_COLLECTION,
  NOTES_COLLECTION,
} from "./constants";
import { isValidSlug, slugifyTitle } from "./slug";

function toMillis(ts: Timestamp | undefined | null): number {
  if (!ts || typeof ts.toMillis !== "function") return Date.now();
  return ts.toMillis();
}

export function normalizeTags(raw: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of raw) {
    const n = t.trim().toLowerCase().slice(0, 48);
    if (n && !seen.has(n)) {
      seen.add(n);
      out.push(n);
    }
  }
  return out.slice(0, 32);
}

/** Strip common markdown for a short plain-text preview. */
export function deriveExcerptFromMarkdown(md: string, maxLen = 220): string {
  const plain = md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>*_\-~|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (plain.length <= maxLen) return plain;
  return `${plain.slice(0, Math.max(0, maxLen - 1))}…`;
}

function mapCategory(slug: string, data: DocumentData): NoteCategoryRecord {
  return {
    slug,
    name: typeof data.name === "string" ? data.name : slug,
    sortOrder:
      typeof data.sortOrder === "number" && Number.isFinite(data.sortOrder)
        ? data.sortOrder
        : 0,
  };
}

function mapNote(id: string, data: DocumentData): NoteRecord {
  const tags = Array.isArray(data.tags)
    ? data.tags.filter((t): t is string => typeof t === "string")
    : [];
  return {
    id,
    title: typeof data.title === "string" ? data.title : "",
    slug: typeof data.slug === "string" ? data.slug : "",
    contentMarkdown:
      typeof data.contentMarkdown === "string" ? data.contentMarkdown : "",
    excerpt:
      data.excerpt === null || typeof data.excerpt === "string"
        ? data.excerpt
        : null,
    categorySlug:
      typeof data.categorySlug === "string" ? data.categorySlug : "other",
    tags,
    isPublic: Boolean(data.isPublic),
    createdAtMs: toMillis(data.createdAt as Timestamp | undefined),
    updatedAtMs: toMillis(data.updatedAt as Timestamp | undefined),
  };
}

function sortCategories(list: NoteCategoryRecord[]): NoteCategoryRecord[] {
  return [...list].sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return a.name.localeCompare(b.name);
  });
}

export async function listNoteCategoriesAdmin(): Promise<NoteCategoryRecord[]> {
  const snap = await getAdminDb().collection(NOTE_CATEGORIES_COLLECTION).get();
  const list = snap.docs.map((d) => mapCategory(d.id, d.data()));
  return sortCategories(list);
}

/** Public filters / labels — same data; no secrets in categories. */
export async function listNoteCategoriesPublic(): Promise<NoteCategoryRecord[]> {
  return listNoteCategoriesAdmin();
}

export async function getNoteCategoryBySlug(
  slug: string,
): Promise<NoteCategoryRecord | null> {
  const doc = await getAdminDb()
    .collection(NOTE_CATEGORIES_COLLECTION)
    .doc(slug)
    .get();
  if (!doc.exists) return null;
  return mapCategory(doc.id, doc.data()!);
}

export async function countNotesInCategory(categorySlug: string): Promise<number> {
  const snap = await getAdminDb()
    .collection(NOTES_COLLECTION)
    .where("categorySlug", "==", categorySlug)
    .get();
  return snap.size;
}

export async function createNoteCategory(
  input: NoteCategoryInput,
): Promise<void> {
  if (!isValidSlug(input.slug)) {
    throw new Error("Invalid category slug");
  }
  const db = getAdminDb();
  const ref = db.collection(NOTE_CATEGORIES_COLLECTION).doc(input.slug);
  const existing = await ref.get();
  if (existing.exists) {
    throw new Error("Category slug already exists");
  }
  await ref.set({
    name: input.name.trim(),
    sortOrder: input.sortOrder,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
}

export async function updateNoteCategory(
  slug: string,
  partial: { name?: string; sortOrder?: number },
): Promise<void> {
  const payload: Record<string, unknown> = {
    updatedAt: FieldValue.serverTimestamp(),
  };
  if (typeof partial.name === "string") payload.name = partial.name.trim();
  if (typeof partial.sortOrder === "number" && Number.isFinite(partial.sortOrder)) {
    payload.sortOrder = partial.sortOrder;
  }
  await getAdminDb()
    .collection(NOTE_CATEGORIES_COLLECTION)
    .doc(slug)
    .update(payload);
}

export async function deleteNoteCategory(slug: string): Promise<void> {
  const n = await countNotesInCategory(slug);
  if (n > 0) {
    throw new Error("Cannot delete a category that still has notes");
  }
  await getAdminDb().collection(NOTE_CATEGORIES_COLLECTION).doc(slug).delete();
}

export async function seedNoteCategoriesIfEmpty(): Promise<{ inserted: number }> {
  const db = getAdminDb();
  const any = await db.collection(NOTE_CATEGORIES_COLLECTION).limit(1).get();
  if (!any.empty) return { inserted: 0 };
  let n = 0;
  for (const c of DEFAULT_NOTE_CATEGORY_SEED) {
    await db.collection(NOTE_CATEGORIES_COLLECTION).doc(c.slug).set({
      name: c.name,
      sortOrder: c.sortOrder,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    n++;
  }
  return { inserted: n };
}

async function isSlugAvailable(slug: string, excludeNoteId?: string): Promise<boolean> {
  const snap = await getAdminDb()
    .collection(NOTES_COLLECTION)
    .where("slug", "==", slug)
    .limit(2)
    .get();
  if (snap.empty) return true;
  if (excludeNoteId && snap.docs.length === 1 && snap.docs[0]!.id === excludeNoteId) {
    return true;
  }
  return false;
}

async function assertCategoryExists(categorySlug: string): Promise<void> {
  const doc = await getAdminDb()
    .collection(NOTE_CATEGORIES_COLLECTION)
    .doc(categorySlug)
    .get();
  if (!doc.exists) {
    throw new Error(`Unknown category: ${categorySlug}`);
  }
}

function normalizeNoteInput(input: NoteInput): NoteInput {
  const slug = input.slug.trim();
  const title = input.title.trim();
  if (!title) throw new Error("Title is required");
  if (!isValidSlug(slug)) throw new Error("Invalid slug format");
  const excerpt =
    input.excerpt === null || input.excerpt.trim() === ""
      ? null
      : input.excerpt.trim().slice(0, 500);
  const contentMarkdown = input.contentMarkdown;
  const finalExcerpt =
    excerpt ?? (contentMarkdown.trim() ? deriveExcerptFromMarkdown(contentMarkdown) : null);
  return {
    title,
    slug,
    contentMarkdown,
    excerpt: finalExcerpt,
    categorySlug: input.categorySlug.trim(),
    tags: normalizeTags(input.tags),
    isPublic: Boolean(input.isPublic),
  };
}

export async function listNotesAdmin(): Promise<NoteRecord[]> {
  const snap = await getAdminDb()
    .collection(NOTES_COLLECTION)
    .orderBy("updatedAt", "desc")
    .get();
  return snap.docs.map((d) => mapNote(d.id, d.data()));
}

export async function listPublicNotes(options?: {
  categorySlug?: string;
}): Promise<NoteRecord[]> {
  const col = getAdminDb().collection(NOTES_COLLECTION);
  const snap = options?.categorySlug
    ? await col
        .where("isPublic", "==", true)
        .where("categorySlug", "==", options.categorySlug)
        .orderBy("updatedAt", "desc")
        .get()
    : await col.where("isPublic", "==", true).orderBy("updatedAt", "desc").get();
  return snap.docs.map((d) => mapNote(d.id, d.data()));
}

export async function getPublicNoteBySlug(slug: string): Promise<NoteRecord | null> {
  const snap = await getAdminDb()
    .collection(NOTES_COLLECTION)
    .where("slug", "==", slug)
    .where("isPublic", "==", true)
    .limit(1)
    .get();
  if (snap.empty) return null;
  const d = snap.docs[0]!;
  return mapNote(d.id, d.data());
}

export async function getNoteByIdAdmin(id: string): Promise<NoteRecord | null> {
  const doc = await getAdminDb().collection(NOTES_COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return mapNote(doc.id, doc.data()!);
}

export async function createNote(raw: NoteInput): Promise<string> {
  const input = normalizeNoteInput(raw);
  await assertCategoryExists(input.categorySlug);
  const available = await isSlugAvailable(input.slug);
  if (!available) throw new Error("Slug already in use");

  const ref = await getAdminDb().collection(NOTES_COLLECTION).add({
    title: input.title,
    slug: input.slug,
    contentMarkdown: input.contentMarkdown,
    excerpt: input.excerpt,
    categorySlug: input.categorySlug,
    tags: input.tags,
    isPublic: input.isPublic,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return ref.id;
}

export async function updateNote(
  id: string,
  raw: Partial<NoteInput>,
): Promise<void> {
  const existing = await getNoteByIdAdmin(id);
  if (!existing) throw new Error("Not found");

  const merged: NoteInput = {
    title: raw.title !== undefined ? raw.title : existing.title,
    slug: raw.slug !== undefined ? raw.slug : existing.slug,
    contentMarkdown:
      raw.contentMarkdown !== undefined
        ? raw.contentMarkdown
        : existing.contentMarkdown,
    excerpt:
      raw.excerpt !== undefined
        ? raw.excerpt
        : raw.contentMarkdown !== undefined
          ? null
          : existing.excerpt,
    categorySlug:
      raw.categorySlug !== undefined ? raw.categorySlug : existing.categorySlug,
    tags: raw.tags !== undefined ? raw.tags : existing.tags,
    isPublic: raw.isPublic !== undefined ? raw.isPublic : existing.isPublic,
  };

  const input = normalizeNoteInput(merged);
  await assertCategoryExists(input.categorySlug);

  if (input.slug !== existing.slug) {
    const available = await isSlugAvailable(input.slug, id);
    if (!available) throw new Error("Slug already in use");
  }

  await getAdminDb()
    .collection(NOTES_COLLECTION)
    .doc(id)
    .update({
      title: input.title,
      slug: input.slug,
      contentMarkdown: input.contentMarkdown,
      excerpt: input.excerpt,
      categorySlug: input.categorySlug,
      tags: input.tags,
      isPublic: input.isPublic,
      updatedAt: FieldValue.serverTimestamp(),
    });
}

export async function deleteNote(id: string): Promise<void> {
  await getAdminDb().collection(NOTES_COLLECTION).doc(id).delete();
}

/** Suggested slug from title (does not check availability). */
export function suggestSlugFromTitle(title: string): string {
  return slugifyTitle(title);
}
