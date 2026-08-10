import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateRange } from "@/lib/utils";
import { DeleteButton } from "@/components/admin/FormControls";
import { MapPin, Calendar, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminExperiencesPage() {
  const items = await prisma.experience.findMany({
    orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }],
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-2xl border border-border bg-white p-5">
        <div>
          <h1 className="text-lg font-semibold">Working Experience</h1>
          <p className="text-sm text-muted">{items.length} {items.length === 1 ? "entry" : "entries"}</p>
        </div>
        <Link href="/admin/experiences/new" className="btn btn-primary">
          + Add experience
        </Link>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const dateRange = formatDateRange(item.startDate, item.endDate, item.isCurrent);
          return (
            <div key={item.id} className="rounded-2xl border border-border bg-white p-5 transition hover:border-neutral-300">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  {/* Logo */}
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-border bg-surface">
                    {item.logoUrl ? (
                      <Image src={item.logoUrl} alt={item.company} fill className="object-contain p-1.5" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-neutral-900 text-xs font-bold text-white">
                        {item.company.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold">{item.role}</h2>
                      {item.isCurrent && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700 ring-1 ring-green-200">
                          <span className="h-1 w-1 rounded-full bg-green-500" />
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-muted">{item.company}</p>
                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted">
                      {dateRange && (
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={11} />{dateRange}
                        </span>
                      )}
                      {item.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={11} />{item.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={`/work/${item.id}`}
                    target="_blank"
                    className="btn btn-secondary"
                    title="Preview"
                  >
                    <ExternalLink size={14} />
                  </Link>
                  <Link href={`/admin/experiences/${item.id}`} className="btn btn-secondary">
                    Edit
                  </Link>
                  <DeleteButton endpoint={`/api/experiences/${item.id}`} />
                </div>
              </div>

              {item.description && (
                <p className="mt-3 line-clamp-2 border-t border-border pt-3 text-sm text-muted">
                  {item.description}
                </p>
              )}
            </div>
          );
        })}
        {items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center">
            <p className="text-sm text-muted">No experiences yet.</p>
            <Link href="/admin/experiences/new" className="btn btn-primary mt-4">
              Add your first experience
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
