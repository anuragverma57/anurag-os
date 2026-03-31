import {
  aboutFocusAreas,
  aboutHeadline,
  aboutParagraphs,
  education,
  experience,
  site,
} from "@/lib/site-content";
import {
  SECTION_IDS,
  type SectionId,
  type SiteSettings,
} from "@/lib/types/site-settings";

export const DEFAULT_SECTION_ORDER: SectionId[] = [...SECTION_IDS];

export function getDefaultSiteSettings(): SiteSettings {
  return {
    site: {
      name: site.name,
      title: site.title,
      tagline: site.tagline,
      location: site.location,
      email: site.email,
      github: site.github,
      linkedin: site.linkedin,
      resumeUrl: site.resumeUrl ?? null,
    },
    about: {
      headline: aboutHeadline,
      paragraphs: [...aboutParagraphs],
      focusAreas: [...aboutFocusAreas],
    },
    experience: experience.map((e) => ({ ...e, highlights: [...e.highlights] })),
    education: education.map((e) => ({ ...e, highlights: [...e.highlights] })),
    sectionOrder: [...DEFAULT_SECTION_ORDER],
    sectionCopy: {
      experience: {
        title: "Where I’ve built & shipped",
        subtitle:
          "Backend-focused roles and internships—impact, stack, and scope at a glance.",
      },
      education: {
        title: "Education",
        subtitle: "Degrees and programs—coursework and highlights.",
      },
      projects: {
        title: "Selected projects",
        subtitle:
          "Highlights from my work and side projects—more experiments and learning repos on",
      },
      contact: {
        title: "Let’s talk",
        body:
          "Open to backend and platform-style roles and to talking shop about APIs, data, and performance. Email is the best way to reach me.",
      },
    },
  };
}
