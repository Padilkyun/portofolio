import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateRange, parseJsonArray } from "@/lib/utils";
import { DeleteButton } from "@/components/admin/FormControls";
import { Calendar, Award, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminBootcampsPage() {
  const items = await prisma.bootcamp.findMany({
    orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }],
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-2xl border border-border bg-white p-5">
        <div>
          <h1 className="text-lg font-semibold">Bootcamp Experience</h1>
          <p className="text-sm text-muted">{items.length} {items.length === 1 ? "entry" : "entries"}</p>
        </div>
        <Link href="/admin/bootcamps/new" className="btn btn-primary">
          + Add bootcamp
        </Link>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const skills = parseJsonArray<string>(item.skills);
          const dateRange = formatDateRange(item.startDate, item.endDate);
          return (
            <div key={item.id} className="rounded-2xl border border-border bg-white p-5 transition hover:border-neutral-300">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  {/* Logo */}
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-border bg-surface">
                    {item.logoUrl ? (
                      <Image src={item.logoUrl} alt={item.name} fill className="object-contain p-1.5" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-neutral-900 text-xs font-bold text-white">
                        {item.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold">{item.name}</h2>
                      {item.certificateUrl && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 ring-1 ring-blue-200">
                          <Award size={9} />
                          Cert
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-muted">{item.organizer || "—"}</p>
                    {dateRange && (
                      <span className="mt-1 inline-flex items-center gap-1 text-xs text-muted">
                        <Calendar size={11} />{dateRange}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={`/bootcamp/${item.id}`}
                    target="_blank"
                    className="btn btn-secondary"
                    title="Preview"
                  >
                    <ExternalLink size={14} />
                  </Link>
                  <Link href={`/admin/bootcamps/${item.id}`} className="btn btn-secondary">
                    Edit
                  </Link>
                  <DeleteButton endpoint={`/api/bootcamps/${item.id}`} />
                </div>
              </div>

              {/* Skills badges */}
              {skills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5 border-t border-border pt-3">
                  {skills.slice(0, 8).map((s) => (
                    <span key={s} className="badge text-[11px]">{s}</span>
                  ))}
                  {skills.length > 8 && (
                    <span className="badge text-[11px] text-muted">+{skills.length - 8} more</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center">
            <p className="text-sm text-muted">No bootcamps yet.</p>
            <Link href="/admin/bootcamps/new" className="btn btn-primary mt-4">
              Add your first bootcamp
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
