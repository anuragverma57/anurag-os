/**
 * CMS-shaped site settings (Firestore `settings/site` + public fallbacks).
 */

export const SECTION_IDS = [
  "hero",
  "about",
  "experience",
  "education",
  "projects",
  "contact",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export type SitePublic = {
  name: string;
  title: string;
  tagline: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  resumeUrl: string | null;
};

export type AboutSection = {
  headline: string;
  paragraphs: string[];
  focusAreas: string[];
};

export type ExperienceItem = {
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  current?: boolean;
  highlights: string[];
};

export type EducationItem = {
  degree: string;
  institution: string;
  location: string;
  start: string;
  end: string;
  current?: boolean;
  highlights: string[];
};

export type SectionCopy = {
  experience: { title: string; subtitle: string };
  education: { title: string; subtitle: string };
  projects: { title: string; subtitle: string };
  contact: { title: string; body: string };
};

export type SiteSettings = {
  site: SitePublic;
  about: AboutSection;
  experience: ExperienceItem[];
  education: EducationItem[];
  sectionOrder: SectionId[];
  sectionCopy: SectionCopy;
};
