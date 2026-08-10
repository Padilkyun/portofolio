import { prisma } from "./prisma";
import { parseJsonArray } from "./utils";

export async function getProfile() {
  return prisma.profile.findFirst();
}

export async function getExperiences() {
  return prisma.experience.findMany({
    orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }],
  });
}

export async function getBootcamps() {
  return prisma.bootcamp.findMany({
    orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }],
  });
}

export async function getSkills() {
  return prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });
}

export async function getProjects(opts?: { featuredOnly?: boolean; includeDraft?: boolean }) {
  return prisma.project.findMany({
    where: {
      ...(opts?.featuredOnly ? { featured: true } : {}),
      ...(opts?.includeDraft ? {} : { status: "published" }),
    },
    orderBy: [{ sortOrder: "asc" }, { year: "desc" }, { createdAt: "desc" }],
    include: {
      stakeholders: { orderBy: { sortOrder: "asc" } },
      _count: { select: { documentations: true, visualizations: true } },
    },
  });
}

export async function getProjectBySlug(slug: string) {
  return prisma.project.findUnique({
    where: { slug },
    include: {
      stakeholders: { orderBy: { sortOrder: "asc" } },
      documentations: { orderBy: { sortOrder: "asc" } },
      visualizations: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function getExperienceById(id: string) {
  return prisma.experience.findUnique({
    where: { id },
    include: { documentations: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function getFullPortfolio() {
  const [profile, experiences, bootcamps, projects, skills, certificates] = await Promise.all([
    prisma.profile.findFirst(),
    prisma.experience.findMany({
      orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }],
      include: { documentations: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.bootcamp.findMany({
      orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }],
    }),
    prisma.project.findMany({
      where: { status: "published" },
      orderBy: [{ sortOrder: "asc" }, { year: "desc" }],
      include: {
        stakeholders: { orderBy: { sortOrder: "asc" } },
        documentations: { orderBy: { sortOrder: "asc" } },
      },
    }),
    prisma.skill.findMany({ orderBy: [{ category: "asc" }, { sortOrder: "asc" }] }),
    prisma.certificate.findMany({ orderBy: [{ sortOrder: "asc" }, { issuedAt: "desc" }] }),
  ]);
  return { profile, experiences, bootcamps, projects, skills, certificates };
}

export async function getCertificates() {
  return prisma.certificate.findMany({
    orderBy: [{ sortOrder: "asc" }, { issuedAt: "desc" }],
  });
}

export function hydrateProject<T extends { techSolutions: string }>(project: T) {
  return {
    ...project,
    techSolutions: parseJsonArray<{ title: string; description?: string }>(project.techSolutions),
  };
}

export function hydrateBootcamp(bootcamp: {
  skills: string;
  [key: string]: unknown;
}) {
  return {
    ...bootcamp,
    skills: parseJsonArray<string>(bootcamp.skills),
  };
}
