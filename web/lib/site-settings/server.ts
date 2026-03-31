import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import {
  SECTION_IDS,
  type SectionId,
  type SiteSettings,
} from "@/lib/types/site-settings";
import { SITE_SETTINGS_COLLECTION, SITE_SETTINGS_DOC_ID } from "./constants";
import { DEFAULT_SECTION_ORDER, getDefaultSiteSettings } from "./defaults";

function isSectionId(s: string): s is SectionId {
  return (SECTION_IDS as readonly string[]).includes(s);
}

/** Ensures every section appears exactly once; unknown ids dropped; missing appended in default order. */
export function normalizeSectionOrder(input: unknown): SectionId[] {
  const allowed = new Set<string>(SECTION_IDS);
  if (!Array.isArray(input)) {
    return [...DEFAULT_SECTION_ORDER];
  }
  const out: SectionId[] = [];
  const seen = new Set<string>();
  for (const raw of input) {
    if (typeof raw !== "string" || !isSectionId(raw) || seen.has(raw)) continue;
    seen.add(raw);
    out.push(raw);
  }
  for (const id of DEFAULT_SECTION_ORDER) {
    if (!seen.has(id)) out.push(id);
  }
  return out;
}

function asString(v: unknown, fallback: string): string {
  return typeof v === "string" ? v : fallback;
}

function asStringOrNull(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  if (typeof v === "string") return v;
  return null;
}

function mergeAbout(
  raw: unknown,
  defaults: SiteSettings["about"],
): SiteSettings["about"] {
  if (!raw || typeof raw !== "object") return defaults;
  const o = raw as Record<string, unknown>;
  const paragraphs = Array.isArray(o.paragraphs)
    ? o.paragraphs.filter((p): p is string => typeof p === "string")
    : defaults.paragraphs;
  const focusAreas = Array.isArray(o.focusAreas)
    ? o.focusAreas.filter((p): p is string => typeof p === "string")
    : defaults.focusAreas;
  return {
    headline: asString(o.headline, defaults.headline),
    paragraphs: paragraphs.length ? paragraphs : defaults.paragraphs,
    focusAreas: focusAreas.length ? focusAreas : defaults.focusAreas,
  };
}

function mergeExperienceItem(
  raw: unknown,
): import("@/lib/types/site-settings").ExperienceItem | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const role = typeof o.role === "string" ? o.role : "";
  const company = typeof o.company === "string" ? o.company : "";
  const location = typeof o.location === "string" ? o.location : "";
  const start = typeof o.start === "string" ? o.start : "";
  const end = typeof o.end === "string" ? o.end : "";
  if (!role || !company) return null;
  const highlights = Array.isArray(o.highlights)
    ? o.highlights.filter((h): h is string => typeof h === "string")
    : [];
  return {
    role,
    company,
    location,
    start,
    end,
    current: Boolean(o.current),
    highlights,
  };
}

function mergeEducationItem(
  raw: unknown,
): import("@/lib/types/site-settings").EducationItem | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const degree = typeof o.degree === "string" ? o.degree : "";
  const institution = typeof o.institution === "string" ? o.institution : "";
  const location = typeof o.location === "string" ? o.location : "";
  const start = typeof o.start === "string" ? o.start : "";
  const end = typeof o.end === "string" ? o.end : "";
  if (!degree || !institution) return null;
  const highlights = Array.isArray(o.highlights)
    ? o.highlights.filter((h): h is string => typeof h === "string")
    : [];
  return {
    degree,
    institution,
    location,
    start,
    end,
    current: Boolean(o.current),
    highlights,
  };
}

function mergeSectionCopy(
  raw: unknown,
  defaults: SiteSettings["sectionCopy"],
): SiteSettings["sectionCopy"] {
  if (!raw || typeof raw !== "object") return defaults;
  const o = raw as Record<string, unknown>;
  const pair = (
    blockKey: "experience" | "education" | "projects",
    titleFb: string,
    subFb: string,
  ) => {
    const block = o[blockKey];
    if (!block || typeof block !== "object") {
      return { title: titleFb, subtitle: subFb };
    }
    const b = block as Record<string, unknown>;
    return {
      title: typeof b.title === "string" ? b.title : titleFb,
      subtitle: typeof b.subtitle === "string" ? b.subtitle : subFb,
    };
  };
  const contactBlock = o.contact;
  let contactTitle = defaults.contact.title;
  let contactBody = defaults.contact.body;
  if (contactBlock && typeof contactBlock === "object") {
    const c = contactBlock as Record<string, unknown>;
    if (typeof c.title === "string") contactTitle = c.title;
    if (typeof c.body === "string") contactBody = c.body;
  }
  return {
    experience: pair(
      "experience",
      defaults.experience.title,
      defaults.experience.subtitle,
    ),
    education: pair(
      "education",
      defaults.education.title,
      defaults.education.subtitle,
    ),
    projects: pair(
      "projects",
      defaults.projects.title,
      defaults.projects.subtitle,
    ),
    contact: { title: contactTitle, body: contactBody },
  };
}

/** Merges partial/unknown payload with code defaults (used for Firestore reads and admin PUT). */
export function mergeFromFirestoreData(
  data: Record<string, unknown>,
): SiteSettings {
  const defaults = getDefaultSiteSettings();
  const siteRaw = data.site;
  const site =
    siteRaw && typeof siteRaw === "object"
      ? (siteRaw as Record<string, unknown>)
      : {};

  const merged: SiteSettings = {
    site: {
      name: asString(site.name, defaults.site.name),
      title: asString(site.title, defaults.site.title),
      tagline: asString(site.tagline, defaults.site.tagline),
      location: asString(site.location, defaults.site.location),
      email: asString(site.email, defaults.site.email),
      github: asString(site.github, defaults.site.github),
      linkedin: asString(site.linkedin, defaults.site.linkedin),
      resumeUrl:
        asStringOrNull(site.resumeUrl) ?? defaults.site.resumeUrl ?? null,
    },
    about: mergeAbout(data.about, defaults.about),
    experience: Array.isArray(data.experience)
      ? data.experience
          .map(mergeExperienceItem)
          .filter(Boolean) as SiteSettings["experience"]
      : defaults.experience,
    education: Array.isArray(data.education)
      ? data.education
          .map(mergeEducationItem)
          .filter(Boolean) as SiteSettings["education"]
      : defaults.education,
    sectionOrder: normalizeSectionOrder(data.sectionOrder),
    sectionCopy: mergeSectionCopy(data.sectionCopy, defaults.sectionCopy),
  };

  return merged;
}

/**
 * Public homepage: Firestore `settings/site` merged with code defaults.
 * On missing doc or error, returns defaults only.
 */
export async function getPublicSiteSettings(): Promise<SiteSettings> {
  const defaults = getDefaultSiteSettings();
  try {
    const db = getAdminDb();
    const snap = await db
      .collection(SITE_SETTINGS_COLLECTION)
      .doc(SITE_SETTINGS_DOC_ID)
      .get();
    if (!snap.exists) return defaults;
    const data = snap.data();
    if (!data || typeof data !== "object") return defaults;
    return mergeFromFirestoreData(data as Record<string, unknown>);
  } catch {
    return defaults;
  }
}

/** Admin: same merge; throws if Firestore fails (caller can handle). */
export async function getSiteSettingsAdmin(): Promise<SiteSettings> {
  const defaults = getDefaultSiteSettings();
  const db = getAdminDb();
  const snap = await db
    .collection(SITE_SETTINGS_COLLECTION)
    .doc(SITE_SETTINGS_DOC_ID)
    .get();
  if (!snap.exists) return defaults;
  const data = snap.data();
  if (!data || typeof data !== "object") return defaults;
  return mergeFromFirestoreData(data as Record<string, unknown>);
}

export async function writeSiteSettings(settings: SiteSettings): Promise<void> {
  await getAdminDb()
    .collection(SITE_SETTINGS_COLLECTION)
    .doc(SITE_SETTINGS_DOC_ID)
    .set({
      ...settings,
      updatedAt: FieldValue.serverTimestamp(),
    });
}
