import {
  FieldValue,
  type DocumentData,
  type Timestamp,
} from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { getNoteCategoryBySlug } from "@/lib/notes/server";
import type {
  ProgressStatus,
  ProgressTopicInput,
  ProgressTopicRecord,
} from "@/lib/types/progress";
import { PROGRESS_STATUSES } from "@/lib/types/progress";
import { PROGRESS_TOPICS_COLLECTION } from "./constants";

function toMillis(ts: Timestamp | undefined | null): number {
  if (!ts || typeof ts.toMillis !== "function") return Date.now();
  return ts.toMillis();
}

function isProgressStatus(s: string): s is ProgressStatus {
  return (PROGRESS_STATUSES as readonly string[]).includes(s);
}

function mapTopic(id: string, data: DocumentData): ProgressTopicRecord {
  const rawStatus = typeof data.status === "string" ? data.status : "not_started";
  const status = isProgressStatus(rawStatus) ? rawStatus : "not_started";

  let confidence: number | null = null;
  if (data.confidence === null || data.confidence === undefined) {
    confidence = null;
  } else if (typeof data.confidence === "number" && Number.isFinite(data.confidence)) {
    const n = Math.round(data.confidence);
    confidence = n >= 1 && n <= 5 ? n : null;
  }

  return {
    id,
    title: typeof data.title === "string" ? data.title : "",
    categorySlug:
      typeof data.categorySlug === "string" ? data.categorySlug : "other",
    status,
    confidence,
    detailNotes:
      data.detailNotes === null || typeof data.detailNotes === "string"
        ? data.detailNotes
        : null,
    sortOrder:
      typeof data.sortOrder === "number" && Number.isFinite(data.sortOrder)
        ? data.sortOrder
        : 0,
    createdAtMs: toMillis(data.createdAt as Timestamp | undefined),
    updatedAtMs: toMillis(data.updatedAt as Timestamp | undefined),
  };
}

function sortTopics(list: ProgressTopicRecord[]): ProgressTopicRecord[] {
  return [...list].sort((a, b) => {
    if (a.categorySlug !== b.categorySlug) {
      return a.categorySlug.localeCompare(b.categorySlug);
    }
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return a.title.localeCompare(b.title);
  });
}

function normalizeInput(input: ProgressTopicInput): ProgressTopicInput {
  const title = input.title.trim();
  if (!title) throw new Error("Title is required");

  const categorySlug = input.categorySlug.trim();
  if (!categorySlug) throw new Error("Category is required");

  if (!isProgressStatus(input.status)) throw new Error("Invalid status");

  let confidence: number | null = null;
  if (input.confidence !== null && input.confidence !== undefined) {
    const n = Math.round(Number(input.confidence));
    if (Number.isFinite(n) && n >= 1 && n <= 5) confidence = n;
  }

  const detailNotes =
    input.detailNotes === null || input.detailNotes.trim() === ""
      ? null
      : input.detailNotes.trim().slice(0, 2000);

  const sortOrder =
    typeof input.sortOrder === "number" && Number.isFinite(input.sortOrder)
      ? input.sortOrder
      : 0;

  return {
    title,
    categorySlug,
    status: input.status,
    confidence,
    detailNotes,
    sortOrder,
  };
}

export async function listProgressTopicsAdmin(): Promise<ProgressTopicRecord[]> {
  const snap = await getAdminDb().collection(PROGRESS_TOPICS_COLLECTION).get();
  const list = snap.docs.map((d) => mapTopic(d.id, d.data()));
  return sortTopics(list);
}

export async function getProgressTopicByIdAdmin(
  id: string,
): Promise<ProgressTopicRecord | null> {
  const doc = await getAdminDb()
    .collection(PROGRESS_TOPICS_COLLECTION)
    .doc(id)
    .get();
  if (!doc.exists) return null;
  return mapTopic(doc.id, doc.data()!);
}

export async function createProgressTopic(
  raw: ProgressTopicInput,
): Promise<string> {
  const input = normalizeInput(raw);
  const cat = await getNoteCategoryBySlug(input.categorySlug);
  if (!cat) {
    throw new Error(`Unknown category: ${input.categorySlug}`);
  }

  const ref = await getAdminDb().collection(PROGRESS_TOPICS_COLLECTION).add({
    title: input.title,
    categorySlug: input.categorySlug,
    status: input.status,
    confidence: input.confidence,
    detailNotes: input.detailNotes,
    sortOrder: input.sortOrder,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return ref.id;
}

export async function updateProgressTopic(
  id: string,
  raw: Partial<ProgressTopicInput>,
): Promise<void> {
  const existing = await getProgressTopicByIdAdmin(id);
  if (!existing) throw new Error("Not found");

  const merged: ProgressTopicInput = {
    title: raw.title !== undefined ? raw.title : existing.title,
    categorySlug:
      raw.categorySlug !== undefined ? raw.categorySlug : existing.categorySlug,
    status: raw.status !== undefined ? raw.status : existing.status,
    confidence:
      raw.confidence !== undefined ? raw.confidence : existing.confidence,
    detailNotes:
      raw.detailNotes !== undefined ? raw.detailNotes : existing.detailNotes,
    sortOrder: raw.sortOrder !== undefined ? raw.sortOrder : existing.sortOrder,
  };

  const input = normalizeInput(merged);
  const cat = await getNoteCategoryBySlug(input.categorySlug);
  if (!cat) {
    throw new Error(`Unknown category: ${input.categorySlug}`);
  }

  await getAdminDb()
    .collection(PROGRESS_TOPICS_COLLECTION)
    .doc(id)
    .update({
      title: input.title,
      categorySlug: input.categorySlug,
      status: input.status,
      confidence: input.confidence,
      detailNotes: input.detailNotes,
      sortOrder: input.sortOrder,
      updatedAt: FieldValue.serverTimestamp(),
    });
}

export async function deleteProgressTopic(id: string): Promise<void> {
  await getAdminDb().collection(PROGRESS_TOPICS_COLLECTION).doc(id).delete();
}
