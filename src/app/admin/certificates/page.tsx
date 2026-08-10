import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DeleteButton } from "@/components/admin/FormControls";
import { Award, Calendar, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCertificatesPage() {
  const items = await prisma.certificate.findMany({
    orderBy: [{ sortOrder: "asc" }, { issuedAt: "desc" }],
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-2xl border border-border bg-white p-5">
        <div>
          <h1 className="text-lg font-semibold">Certificates</h1>
          <p className="text-sm text-muted">
            {items.length} {items.length === 1 ? "entry" : "entries"}
          </p>
        </div>
        <Link href="/admin/certificates/new" className="btn btn-primary">
          + Add certificate
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="overflow-hidden rounded-2xl border border-border bg-white transition hover:border-neutral-300"
          >
            {/* Thumbnail */}
            <div className="relative aspect-[4/3] w-full bg-neutral-100">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Award size={32} className="text-neutral-300" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4">
              <p className="truncate font-semibold">{item.title}</p>
              {item.issuer && (
                <p className="mt-0.5 truncate text-sm text-muted">{item.issuer}</p>
              )}
              {item.issuedAt && (
                <span className="mt-1 inline-flex items-center gap-1 text-xs text-muted">
                  <Calendar size={11} />
                  {new Date(item.issuedAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              )}
              {item.description && (
                <p className="mt-2 line-clamp-2 text-xs text-muted">{item.description}</p>
              )}

              {/* Actions */}
              <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
                {item.credentialUrl && (
                  <a
                    href={item.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary !py-1.5 !text-xs"
                    title="View credential"
                  >
                    <ExternalLink size={13} />
                  </a>
                )}
                <Link
                  href={`/admin/certificates/${item.id}`}
                  className="btn btn-secondary !py-1.5 !text-xs flex-1 text-center"
                >
                  Edit
                </Link>
                <DeleteButton
                  endpoint={`/api/certificates/${item.id}`}
                  label="Del"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center">
          <Award size={32} className="mx-auto mb-3 text-neutral-300" />
          <p className="text-sm text-muted">No certificates yet.</p>
          <Link href="/admin/certificates/new" className="btn btn-primary mt-4">
            Add your first certificate
          </Link>
        </div>
      )}
    </div>
  );
}
