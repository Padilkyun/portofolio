import { BootcampList } from "@/components/BootcampList";
import { CertificateMarquee } from "@/components/CertificateMarquee";
import { ContactCTA } from "@/components/ContactCTA";
import { ExperienceList } from "@/components/ExperienceList";
import { FilteredProjects } from "@/components/FilteredProjects";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { SkillsGrid } from "@/components/SkillsGrid";
import { getBootcamps, getCertificates, getExperiences, getProfile, getProjects, getSkills } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [profile, experiences, bootcamps, projects, skills, certificates] = await Promise.all([
    getProfile(),
    getExperiences(),
    getBootcamps(),
    getProjects(),
    getSkills(),
    getCertificates(),
  ]);

  return (
    <>
      <Hero profile={profile} />

      <Section
        id="experience"
        title="Working Experience"
        subtitle="Roles where systems, sensors, and software meet."
        className="bg-white"
      >
        <ExperienceList items={experiences} />
      </Section>

      <Section
        id="bootcamp"
        title="Bootcamp Experience"
        subtitle="Structured learning that sharpened delivery speed."
        className="bg-surface"
      >
        <BootcampList items={bootcamps} />
      </Section>

      <Section
        id="portfolio"
        title="Selected Portfolio"
        subtitle="Case studies from AIoT builds, hackathons, and field systems."
        className="bg-white"
      >
        <FilteredProjects projects={projects} />
      </Section>

      <Section
        id="skills"
        title="Skills"
        subtitle="Stack across edge, cloud, data, and product delivery."
        className="bg-surface"
      >
        <SkillsGrid items={skills} />
      </Section>

      {certificates.length > 0 && (
        <Section
          id="certificates"
          title="Certificates"
          subtitle="Credentials earned across AI, IoT, and engineering programs."
          className="bg-white"
        >
          <CertificateMarquee items={certificates} />
        </Section>
      )}

      <ContactCTA />
    </>
  );
}
