import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DeleteButton } from "@/components/admin/FormControls";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const items = await prisma.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { year: "desc" }],
    include: {
      _count: {
        select: { stakeholders: true, documentations: true, visualizations: true },
      },
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-2xl border border-border bg-white p-5">
        <div>
          <h1 className="text-lg font-semibold">Projects</h1>
          <p className="text-sm text-muted">{items.length} projects</p>
        </div>
        <Link href="/admin/projects/new" className="btn btn-primary">
          New project
        </Link>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-border bg-white p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="mb-1 flex flex-wrap gap-2">
                  <span className="badge">{item.status}</span>
                  {item.featured && <span className="badge">featured</span>}
                  {item.year && <span className="badge">{item.year}</span>}
                </div>
                <h2 className="font-semibold">{item.title}</h2>
                <p className="text-sm text-muted">/{item.slug}</p>
                <p className="mt-2 text-xs text-muted">
                  {item._count.stakeholders} stakeholders · {item._count.documentations} docs ·{" "}
                  {item._count.visualizations} viz
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/projects/${item.slug}`} className="btn btn-secondary" target="_blank">
                  View
                </Link>
                <Link href={`/admin/projects/${item.id}`} className="btn btn-secondary">
                  Edit
                </Link>
                <DeleteButton endpoint={`/api/projects/${item.id}`} />
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border bg-white p-8 text-center text-sm text-muted">
            No projects yet.
          </p>
        )}
      </div>
    </div>
  );
}
