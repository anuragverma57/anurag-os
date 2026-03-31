import { Footer } from "@/components/portfolio/footer";
import { Header } from "@/components/portfolio/header";
import { getPublicSiteSettings } from "@/lib/site-settings/server";

export const dynamic = "force-dynamic";

export default async function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getPublicSiteSettings();
  return (
    <>
      <Header site={settings.site} sectionOrder={settings.sectionOrder} />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer site={settings.site} />
    </>
  );
}
