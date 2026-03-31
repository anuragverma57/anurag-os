"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  EducationItem,
  ExperienceItem,
  SectionId,
  SiteSettings,
} from "@/lib/types/site-settings";
const SECTION_LABELS: Record<SectionId, string> = {
  hero: "Hero",
  about: "About",
  experience: "Experience",
  education: "Education",
  projects: "Projects",
  contact: "Contact",
};

function emptyExperience(): ExperienceItem {
  return {
    role: "",
    company: "",
    location: "",
    start: "",
    end: "",
    current: false,
    highlights: [],
  };
}

function emptyEducation(): EducationItem {
  return {
    degree: "",
    institution: "",
    location: "",
    start: "",
    end: "",
    current: false,
    highlights: [],
  };
}

function highlightsFromText(t: string): string[] {
  return t
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function highlightsToText(h: string[]): string {
  return h.join("\n");
}

export function SiteSettingsEditor() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      const res = await fetch("/api/admin/site");
      const data = (await res.json()) as { settings?: SiteSettings; error?: string };
      if (!res.ok) {
        setLoadError(data.error ?? "Failed to load");
        return;
      }
      if (data.settings) {
        setSettings(structuredClone(data.settings));
      }
    } catch {
      setLoadError("Network error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function save() {
    if (!settings) return;
    setSaving(true);
    setSaveError(null);
    setSavedAt(null);
    try {
      const res = await fetch("/api/admin/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = (await res.json()) as { settings?: SiteSettings; error?: string };
      if (!res.ok) {
        setSaveError(data.error ?? "Save failed");
        return;
      }
      if (data.settings) {
        setSettings(structuredClone(data.settings));
      }
      setSavedAt(new Date().toLocaleTimeString());
    } catch {
      setSaveError("Network error");
    } finally {
      setSaving(false);
    }
  }

  function moveSection(index: number, dir: -1 | 1) {
    if (!settings) return;
    const j = index + dir;
    if (j < 0 || j >= settings.sectionOrder.length) return;
    const next = [...settings.sectionOrder];
    [next[index], next[j]] = [next[j]!, next[index]!];
    setSettings({ ...settings, sectionOrder: next });
  }

  if (loadError) {
    return (
      <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
        {loadError}
        <button
          type="button"
          onClick={() => void load()}
          className="ml-4 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!settings) {
    return <p className="text-[var(--muted)]">Loading…</p>;
  }

  const s = settings;

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => void save()}
          disabled={saving}
          className="rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--accent-fg)] disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save site settings"}
        </button>
        {savedAt ? (
          <span className="text-sm text-[var(--muted)]">Saved {savedAt}</span>
        ) : null}
        {saveError ? (
          <span className="text-sm text-red-400">{saveError}</span>
        ) : null}
      </div>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-lg font-semibold text-[var(--text)]">General</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field
            label="Name"
            value={s.site.name}
            onChange={(v) =>
              setSettings({ ...s, site: { ...s.site, name: v } })
            }
          />
          <Field
            label="Title"
            value={s.site.title}
            onChange={(v) =>
              setSettings({ ...s, site: { ...s.site, title: v } })
            }
          />
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-[var(--muted)]">
              Tagline
            </label>
            <textarea
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)]"
              rows={3}
              value={s.site.tagline}
              onChange={(e) =>
                setSettings({
                  ...s,
                  site: { ...s.site, tagline: e.target.value },
                })
              }
            />
          </div>
          <Field
            label="Location"
            value={s.site.location}
            onChange={(v) =>
              setSettings({ ...s, site: { ...s.site, location: v } })
            }
          />
          <Field
            label="Email"
            value={s.site.email}
            onChange={(v) =>
              setSettings({ ...s, site: { ...s.site, email: v } })
            }
          />
          <Field
            label="GitHub URL"
            value={s.site.github}
            onChange={(v) =>
              setSettings({ ...s, site: { ...s.site, github: v } })
            }
          />
          <Field
            label="LinkedIn URL"
            value={s.site.linkedin}
            onChange={(v) =>
              setSettings({ ...s, site: { ...s.site, linkedin: v } })
            }
          />
          <Field
            label="Résumé URL (optional)"
            value={s.site.resumeUrl ?? ""}
            onChange={(v) =>
              setSettings({
                ...s,
                site: {
                  ...s.site,
                  resumeUrl: v.trim() ? v.trim() : null,
                },
              })
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-lg font-semibold text-[var(--text)]">
          Section order
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Homepage order (hero is usually first). Use Up / Down to reorder.
        </p>
        <ul className="mt-4 space-y-2">
          {s.sectionOrder.map((id, i) => (
            <li
              key={id}
              className="flex flex-wrap items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm"
            >
              <span className="font-medium text-[var(--text)]">
                {SECTION_LABELS[id]}
              </span>
              <span className="text-[var(--muted)]">({id})</span>
              <div className="ml-auto flex gap-1">
                <button
                  type="button"
                  className="rounded border border-[var(--border)] px-2 py-1 text-xs"
                  onClick={() => moveSection(i, -1)}
                  disabled={i === 0}
                >
                  Up
                </button>
                <button
                  type="button"
                  className="rounded border border-[var(--border)] px-2 py-1 text-xs"
                  onClick={() => moveSection(i, 1)}
                  disabled={i === s.sectionOrder.length - 1}
                >
                  Down
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-lg font-semibold text-[var(--text)]">About</h2>
        <div className="mt-4 space-y-4">
          <Field
            label="Headline"
            value={s.about.headline}
            onChange={(v) =>
              setSettings({ ...s, about: { ...s.about, headline: v } })
            }
          />
          <div>
            <label className="block text-xs font-medium text-[var(--muted)]">
              Paragraphs (separate with a blank line)
            </label>
            <textarea
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono text-sm text-[var(--text)]"
              rows={10}
              value={s.about.paragraphs.join("\n\n")}
              onChange={(e) =>
                setSettings({
                  ...s,
                  about: {
                    ...s.about,
                    paragraphs: e.target.value
                      .split(/\n\n+/)
                      .map((p) => p.trim())
                      .filter(Boolean),
                  },
                })
              }
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--muted)]">
              Focus areas (one per line)
            </label>
            <textarea
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono text-sm text-[var(--text)]"
              rows={5}
              value={s.about.focusAreas.join("\n")}
              onChange={(e) =>
                setSettings({
                  ...s,
                  about: {
                    ...s.about,
                    focusAreas: highlightsFromText(e.target.value),
                  },
                })
              }
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-lg font-semibold text-[var(--text)]">
          Section headings
        </h2>
        <div className="mt-4 grid gap-6">
          <div className="grid gap-2 sm:grid-cols-2">
            <Field
              label="Experience — title"
              value={s.sectionCopy.experience.title}
              onChange={(v) =>
                setSettings({
                  ...s,
                  sectionCopy: {
                    ...s.sectionCopy,
                    experience: { ...s.sectionCopy.experience, title: v },
                  },
                })
              }
            />
            <Field
              label="Experience — subtitle"
              value={s.sectionCopy.experience.subtitle}
              onChange={(v) =>
                setSettings({
                  ...s,
                  sectionCopy: {
                    ...s.sectionCopy,
                    experience: { ...s.sectionCopy.experience, subtitle: v },
                  },
                })
              }
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Field
              label="Education — title"
              value={s.sectionCopy.education.title}
              onChange={(v) =>
                setSettings({
                  ...s,
                  sectionCopy: {
                    ...s.sectionCopy,
                    education: { ...s.sectionCopy.education, title: v },
                  },
                })
              }
            />
            <Field
              label="Education — subtitle"
              value={s.sectionCopy.education.subtitle}
              onChange={(v) =>
                setSettings({
                  ...s,
                  sectionCopy: {
                    ...s.sectionCopy,
                    education: { ...s.sectionCopy.education, subtitle: v },
                  },
                })
              }
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Field
              label="Projects — title"
              value={s.sectionCopy.projects.title}
              onChange={(v) =>
                setSettings({
                  ...s,
                  sectionCopy: {
                    ...s.sectionCopy,
                    projects: { ...s.sectionCopy.projects, title: v },
                  },
                })
              }
            />
            <Field
              label="Projects — intro (before GitHub link)"
              value={s.sectionCopy.projects.subtitle}
              onChange={(v) =>
                setSettings({
                  ...s,
                  sectionCopy: {
                    ...s.sectionCopy,
                    projects: { ...s.sectionCopy.projects, subtitle: v },
                  },
                })
              }
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Field
              label="Contact — title"
              value={s.sectionCopy.contact.title}
              onChange={(v) =>
                setSettings({
                  ...s,
                  sectionCopy: {
                    ...s.sectionCopy,
                    contact: { ...s.sectionCopy.contact, title: v },
                  },
                })
              }
            />
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-[var(--muted)]">
                Contact — body
              </label>
              <textarea
                className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)]"
                rows={3}
                value={s.sectionCopy.contact.body}
                onChange={(e) =>
                  setSettings({
                    ...s,
                    sectionCopy: {
                      ...s.sectionCopy,
                      contact: {
                        ...s.sectionCopy.contact,
                        body: e.target.value,
                      },
                    },
                  })
                }
              />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-[var(--text)]">
            Experience
          </h2>
          <button
            type="button"
            className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm"
            onClick={() =>
              setSettings({
                ...s,
                experience: [...s.experience, emptyExperience()],
              })
            }
          >
            Add role
          </button>
        </div>
        <div className="mt-6 space-y-8">
          {s.experience.map((row, idx) => (
            <div
              key={`exp-${idx}`}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4"
            >
              <div className="mb-3 flex justify-between gap-2">
                <span className="text-xs font-medium text-[var(--muted)]">
                  Role {idx + 1}
                </span>
                <button
                  type="button"
                  className="text-xs text-red-400"
                  onClick={() =>
                    setSettings({
                      ...s,
                      experience: s.experience.filter((_, i) => i !== idx),
                    })
                  }
                >
                  Remove
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label="Role"
                  value={row.role}
                  onChange={(v) => {
                    const next = [...s.experience];
                    next[idx] = { ...row, role: v };
                    setSettings({ ...s, experience: next });
                  }}
                />
                <Field
                  label="Company"
                  value={row.company}
                  onChange={(v) => {
                    const next = [...s.experience];
                    next[idx] = { ...row, company: v };
                    setSettings({ ...s, experience: next });
                  }}
                />
                <Field
                  label="Location"
                  value={row.location}
                  onChange={(v) => {
                    const next = [...s.experience];
                    next[idx] = { ...row, location: v };
                    setSettings({ ...s, experience: next });
                  }}
                />
                <Field
                  label="Start"
                  value={row.start}
                  onChange={(v) => {
                    const next = [...s.experience];
                    next[idx] = { ...row, start: v };
                    setSettings({ ...s, experience: next });
                  }}
                />
                <Field
                  label="End"
                  value={row.end}
                  onChange={(v) => {
                    const next = [...s.experience];
                    next[idx] = { ...row, end: v };
                    setSettings({ ...s, experience: next });
                  }}
                />
                <label className="flex items-center gap-2 text-sm text-[var(--text)] sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={Boolean(row.current)}
                    onChange={(e) => {
                      const next = [...s.experience];
                      next[idx] = { ...row, current: e.target.checked };
                      setSettings({ ...s, experience: next });
                    }}
                  />
                  Current role
                </label>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[var(--muted)]">
                    Highlights (one per line)
                  </label>
                  <textarea
                    className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-mono text-sm"
                    rows={4}
                    value={highlightsToText(row.highlights)}
                    onChange={(e) => {
                      const next = [...s.experience];
                      next[idx] = {
                        ...row,
                        highlights: highlightsFromText(e.target.value),
                      };
                      setSettings({ ...s, experience: next });
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-[var(--text)]">
            Education
          </h2>
          <button
            type="button"
            className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm"
            onClick={() =>
              setSettings({
                ...s,
                education: [...s.education, emptyEducation()],
              })
            }
          >
            Add entry
          </button>
        </div>
        <div className="mt-6 space-y-8">
          {s.education.map((row, idx) => (
            <div
              key={`edu-${idx}`}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4"
            >
              <div className="mb-3 flex justify-between gap-2">
                <span className="text-xs font-medium text-[var(--muted)]">
                  School {idx + 1}
                </span>
                <button
                  type="button"
                  className="text-xs text-red-400"
                  onClick={() =>
                    setSettings({
                      ...s,
                      education: s.education.filter((_, i) => i !== idx),
                    })
                  }
                >
                  Remove
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label="Degree / program"
                  value={row.degree}
                  onChange={(v) => {
                    const next = [...s.education];
                    next[idx] = { ...row, degree: v };
                    setSettings({ ...s, education: next });
                  }}
                />
                <Field
                  label="Institution"
                  value={row.institution}
                  onChange={(v) => {
                    const next = [...s.education];
                    next[idx] = { ...row, institution: v };
                    setSettings({ ...s, education: next });
                  }}
                />
                <Field
                  label="Location"
                  value={row.location}
                  onChange={(v) => {
                    const next = [...s.education];
                    next[idx] = { ...row, location: v };
                    setSettings({ ...s, education: next });
                  }}
                />
                <Field
                  label="Start"
                  value={row.start}
                  onChange={(v) => {
                    const next = [...s.education];
                    next[idx] = { ...row, start: v };
                    setSettings({ ...s, education: next });
                  }}
                />
                <Field
                  label="End"
                  value={row.end}
                  onChange={(v) => {
                    const next = [...s.education];
                    next[idx] = { ...row, end: v };
                    setSettings({ ...s, education: next });
                  }}
                />
                <label className="flex items-center gap-2 text-sm text-[var(--text)] sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={Boolean(row.current)}
                    onChange={(e) => {
                      const next = [...s.education];
                      next[idx] = { ...row, current: e.target.checked };
                      setSettings({ ...s, education: next });
                    }}
                  />
                  Current program
                </label>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[var(--muted)]">
                    Highlights (one per line)
                  </label>
                  <textarea
                    className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-mono text-sm"
                    rows={4}
                    value={highlightsToText(row.highlights)}
                    onChange={(e) => {
                      const next = [...s.education];
                      next[idx] = {
                        ...row,
                        highlights: highlightsFromText(e.target.value),
                      };
                      setSettings({ ...s, education: next });
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <p className="text-xs text-[var(--muted)]">
        Projects are still managed under{" "}
        <a href="/admin/projects" className="text-[var(--accent)] underline">
          Projects
        </a>
        . Section order controls where the project grid appears on the homepage.
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-[var(--muted)]">
        {label}
      </label>
      <input
        className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
