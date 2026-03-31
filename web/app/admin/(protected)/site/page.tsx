import { SiteSettingsEditor } from "@/components/admin/site-settings-editor";

export const dynamic = "force-dynamic";

export default function AdminSitePage() {
  return (
    <div className="max-w-3xl">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
        Site content
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
        Edit homepage copy, experience, education, section headings, and the order
        of sections. Changes apply to the public site after you save.
      </p>
      <div className="mt-10">
        <SiteSettingsEditor />
      </div>
    </div>
  );
}
