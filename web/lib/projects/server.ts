import { FieldValue, type DocumentData } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { fallbackProjects } from "@/lib/site-content";
import type { ProjectInput, ProjectRecord } from "@/lib/types/project";
import { PROJECTS_COLLECTION } from "@/lib/projects/constants";

function mapDoc(id: string, data: DocumentData): ProjectRecord {
  const stack = Array.isArray(data.stack)
    ? data.stack.filter((s): s is string => typeof s === "string")
    : [];
  return {
    id,
    title: typeof data.title === "string" ? data.title : "",
    description: typeof data.description === "string" ? data.description : "",
    stack,
    href: typeof data.href === "string" ? data.href : "#",
    repo: typeof data.repo === "string" && data.repo ? data.repo : undefined,
    linkLabel:
      typeof data.linkLabel === "string" && data.linkLabel
        ? data.linkLabel
        : undefined,
    featured: Boolean(data.featured),
    isPublic: Boolean(data.isPublic),
    sortOrder: typeof data.sortOrder === "number" ? data.sortOrder : 0,
  };
}

function sortProjects(list: ProjectRecord[]): ProjectRecord[] {
  return [...list].sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return a.title.localeCompare(b.title);
  });
}

/**
 * Public portfolio: only isPublic === true.
 * On failure or empty DB, falls back to static `fallbackProjects` (Phase 2 bootstrap).
 */
export async function getPublicProjectsForPage(): Promise<ProjectRecord[]> {
  const toFallback = (): ProjectRecord[] =>
    sortProjects(
      fallbackProjects.map((p, i) => ({
        id: `fallback-${i}`,
        title: p.title,
        description: p.description,
        stack: p.stack,
        href: p.href,
        repo: p.repo,
        linkLabel: p.linkLabel,
        featured: p.featured,
        isPublic: true,
        sortOrder: i,
      })),
    );

  try {
    const db = getAdminDb();
    const any = await db.collection(PROJECTS_COLLECTION).limit(1).get();
    if (any.empty) {
      return toFallback();
    }

    const snap = await db
      .collection(PROJECTS_COLLECTION)
      .where("isPublic", "==", true)
      .get();

    const list = snap.docs.map((d) => mapDoc(d.id, d.data()));
    return sortProjects(list);
  } catch {
    return toFallback();
  }
}

/** Admin: all projects (public + private). */
export async function getAllProjectsAdmin(): Promise<ProjectRecord[]> {
  const snap = await getAdminDb().collection(PROJECTS_COLLECTION).get();
  const list = snap.docs.map((d) => mapDoc(d.id, d.data()));
  return sortProjects(list);
}

export async function getProjectByIdAdmin(
  id: string,
): Promise<ProjectRecord | null> {
  const doc = await getAdminDb().collection(PROJECTS_COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return mapDoc(doc.id, doc.data()!);
}

export async function createProject(input: ProjectInput): Promise<string> {
  const ref = await getAdminDb().collection(PROJECTS_COLLECTION).add({
    ...input,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return ref.id;
}

export async function updateProject(
  id: string,
  input: Partial<ProjectInput>,
): Promise<void> {
  const payload: Record<string, unknown> = {
    updatedAt: FieldValue.serverTimestamp(),
  };
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) {
      payload[key] = value;
    }
  }
  await getAdminDb().collection(PROJECTS_COLLECTION).doc(id).update(payload);
}

export async function deleteProject(id: string): Promise<void> {
  await getAdminDb().collection(PROJECTS_COLLECTION).doc(id).delete();
}

export async function seedProjectsFromFallback(): Promise<{ inserted: number }> {
  const db = getAdminDb();
  const existing = await db.collection(PROJECTS_COLLECTION).limit(1).get();
  if (!existing.empty) {
    return { inserted: 0 };
  }
  let n = 0;
  for (let i = 0; i < fallbackProjects.length; i++) {
    const p = fallbackProjects[i]!;
    await db.collection(PROJECTS_COLLECTION).add({
      title: p.title,
      description: p.description,
      stack: p.stack,
      href: p.href,
      repo: p.repo ?? null,
      linkLabel: p.linkLabel ?? null,
      featured: Boolean(p.featured),
      isPublic: true,
      sortOrder: i,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    n++;
  }
  return { inserted: n };
}
