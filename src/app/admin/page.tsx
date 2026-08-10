import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const [projects, experiences, bootcamps, skills, profile, certificates] = await Promise.all([
    prisma.project.count(),
    prisma.experience.count(),
    prisma.bootcamp.count(),
    prisma.skill.count(),
    prisma.profile.findFirst(),
    prisma.certificate.count(),
  ]);

  const cards = [
    { label: "Projects", value: projects, href: "/admin/projects" },
    { label: "Experiences", value: experiences, href: "/admin/experiences" },
    { label: "Bootcamps", value: bootcamps, href: "/admin/bootcamps" },
    { label: "Skills", value: skills, href: "/admin/skills" },
    { label: "Certificates", value: certificates, href: "/admin/certificates" },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-white p-6">
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">
          Welcome{profile?.name ? `, ${profile.name}` : ""}. Manage all portfolio content here.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="card p-5 hover:border-neutral-300">
            <p className="text-xs uppercase tracking-[0.14em] text-muted">{c.label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">{c.value}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-white p-6">
        <h2 className="font-semibold">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin/projects/new" className="btn btn-primary">
            New project
          </Link>
          <Link href="/admin/profile" className="btn btn-secondary">
            Edit profile
          </Link>
          <Link href="/admin/experiences/new" className="btn btn-secondary">
            Add experience
          </Link>
          <Link href="/admin/bootcamps/new" className="btn btn-secondary">
            Add bootcamp
          </Link>
          <Link href="/admin/certificates/new" className="btn btn-secondary">
            Add certificate
          </Link>
        </div>
      </div>
    </div>
  );
}
