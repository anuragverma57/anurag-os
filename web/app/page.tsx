import { About } from "@/components/portfolio/about";
import { Contact } from "@/components/portfolio/contact";
import { Education } from "@/components/portfolio/education";
import { Experience } from "@/components/portfolio/experience";
import { Footer } from "@/components/portfolio/footer";
import { Header } from "@/components/portfolio/header";
import { Hero } from "@/components/portfolio/hero";
import { Projects } from "@/components/portfolio/projects";
import { getPublicProjectsForPage } from "@/lib/projects/server";
import { getPublicSiteSettings } from "@/lib/site-settings/server";
import type { SectionId } from "@/lib/types/site-settings";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [settings, projects] = await Promise.all([
    getPublicSiteSettings(),
    getPublicProjectsForPage(),
  ]);

  const order = settings.sectionOrder;

  const sections: Record<SectionId, ReactNode> = {
    hero: <Hero key="hero" site={settings.site} />,
    about: <About key="about" about={settings.about} />,
    experience: (
      <Experience
        key="experience"
        items={settings.experience}
        copy={settings.sectionCopy.experience}
      />
    ),
    education: (
      <Education
        key="education"
        items={settings.education}
        copy={settings.sectionCopy.education}
      />
    ),
    projects: (
      <Projects
        key="projects"
        projects={projects}
        githubUrl={settings.site.github}
        copy={settings.sectionCopy.projects}
      />
    ),
    contact: (
      <Contact
        key="contact"
        site={settings.site}
        copy={settings.sectionCopy.contact}
      />
    ),
  };

  return (
    <>
      <Header site={settings.site} sectionOrder={order} />
      <main className="flex flex-1 flex-col">
        {order.map((id) => sections[id])}
      </main>
      <Footer site={settings.site} />
    </>
  );
}
