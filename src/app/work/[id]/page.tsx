import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, MapPin, Calendar, Briefcase, Building2,
  FileText, Link2, AlignLeft, CheckCircle2,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDateRange, parseJsonArray } from "@/lib/utils";

export const dynamic = "force-dynamic";

const DOC_TYPE_ICON: Record<string, React.ReactNode> = {
  link: <Link2 size={14} />,
  file: <FileText size={14} />,
  text: <AlignLeft size={14} />,
};

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exp = await prisma.experience.findUnique({
    where: { id },
    include: { documentations: { orderBy: { sortOrder: "asc" } } },
  });
  if (!exp) notFound();

  const skills = parseJsonArray<string>(exp.skills);

  const dateRange = formatDateRange(exp.startDate, exp.endDate, exp.isCurrent);
  const start = new Date(exp.startDate);
  const end = exp.isCurrent ? new Date() : exp.endDate ? new Date(exp.endDate) : new Date();
  const totalMonths =
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const duration =
    years > 0 ? (months > 0 ? `${years} yr ${months} mo` : `${years} yr`) : `${months} mo`;

  return (
    <main className="min-h-screen bg-white">
      {/* ── Cover photo ── */}
      {exp.photoUrl && (
        <div className="relative h-52 w-full overflow-hidden bg-neutral-100 md:h-72">
          <Image src={exp.photoUrl} alt={`${exp.company} photo`} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent" />
        </div>
      )}

      {/* ── Hero ── */}
      <div className="border-b border-border bg-white">
        <div className="container-page py-10 md:py-14">
          <Link href="/#experience"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted transition hover:text-foreground">
            <ArrowLeft size={14} /> Back to experience
          </Link>

          <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-10">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm md:h-24 md:w-24">
              {exp.logoUrl ? (
                <Image src={exp.logoUrl} alt={exp.company} fill className="object-contain p-2.5" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-neutral-900 text-xl font-bold text-white">
                  {exp.company.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex-1">
              {exp.isCurrent && (
                <div className="mb-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-200">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                    Current Position
                  </span>
                </div>
              )}
              <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl">
                {exp.role}
              </h1>
              <p className="mt-2 text-lg font-medium text-muted">{exp.company}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted">
                {exp.location && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1">
                    <MapPin size={13} /> {exp.location}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1">
                  <Calendar size={13} /> {dateRange}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1">
                  <Briefcase size={13} /> {duration}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="container-page py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_300px]">

          {/* Left */}
          <div className="space-y-10">
            {/* About */}
            <section>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">About This Role</h2>
              <div className="rounded-2xl border border-border bg-surface p-6 md:p-8">
                {exp.description ? (
                  <p className="prose-lite whitespace-pre-wrap text-base leading-relaxed text-neutral-700">
                    {exp.description}
                  </p>
                ) : (
                  <p className="text-sm text-muted">No description provided.</p>
                )}
              </div>
            </section>

            {/* Skills */}
            {skills.length > 0 && (
              <section>
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Skills Used</h2>
                <div className="grid gap-2 sm:grid-cols-2">
                  {skills.map((s) => (
                    <div key={s} className="flex items-center gap-2.5 rounded-xl border border-border bg-surface px-4 py-2.5">
                      <CheckCircle2 size={14} className="shrink-0 text-neutral-400" />
                      <span className="text-sm font-medium">{s}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Timeline bar */}
            <section>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Timeline</h2>
              <div className="rounded-2xl border border-border bg-white p-6">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-xs text-muted">Start</p>
                    <p className="mt-0.5 font-semibold">
                      {start.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <div className="relative flex-1">
                    <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
                      <div className={`h-full w-full rounded-full ${exp.isCurrent ? "bg-green-500" : "bg-neutral-900"}`} />
                    </div>
                    <div className="mt-1 text-center text-xs text-muted">{duration}</div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted">End</p>
                    <p className="mt-0.5 font-semibold">
                      {exp.isCurrent ? "Present" : exp.endDate
                        ? new Date(exp.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Documentation */}
            {exp.documentations.length > 0 && (
              <section>
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  Documentation
                </h2>
                <div className="space-y-2">
                  {exp.documentations.map((doc) => (
                    <div key={doc.id}
                      className="flex items-start gap-3 rounded-2xl border border-border bg-white p-4 transition hover:border-neutral-300">
                      <span className="mt-0.5 shrink-0 text-muted">
                        {DOC_TYPE_ICON[doc.type] ?? <Link2 size={14} />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm">{doc.title}</p>
                        {doc.url && (
                          <a href={doc.url} target="_blank" rel="noreferrer"
                            className="mt-0.5 block truncate text-xs text-muted underline-offset-2 hover:underline hover:text-foreground">
                            {doc.url}
                          </a>
                        )}
                        {doc.content && (
                          <p className="mt-1 text-sm leading-relaxed text-neutral-600 whitespace-pre-wrap">
                            {doc.content}
                          </p>
                        )}
                      </div>
                      {doc.url && (
                        <a href={doc.url} target="_blank" rel="noreferrer"
                          className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted transition hover:border-neutral-400 hover:text-foreground">
                          Open ↗
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right sidebar */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-border bg-white p-5">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-muted">Company</h3>
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-border bg-surface">
                  {exp.logoUrl ? (
                    <Image src={exp.logoUrl} alt={exp.company} fill className="object-contain p-1.5" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-neutral-900 text-xs font-bold text-white">
                      {exp.company.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold">{exp.company}</p>
                  {exp.location && <p className="text-xs text-muted">{exp.location}</p>}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-white p-5">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-muted">Details</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Building2 size={14} className="mt-0.5 shrink-0 text-muted" />
                  <div><dt className="text-xs text-muted">Role</dt><dd className="font-medium">{exp.role}</dd></div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar size={14} className="mt-0.5 shrink-0 text-muted" />
                  <div><dt className="text-xs text-muted">Period</dt><dd className="font-medium">{dateRange}</dd></div>
                </div>
                <div className="flex items-start gap-2">
                  <Briefcase size={14} className="mt-0.5 shrink-0 text-muted" />
                  <div><dt className="text-xs text-muted">Duration</dt><dd className="font-medium">{duration}</dd></div>
                </div>
                {exp.location && (
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="mt-0.5 shrink-0 text-muted" />
                    <div><dt className="text-xs text-muted">Location</dt><dd className="font-medium">{exp.location}</dd></div>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${exp.isCurrent ? "bg-green-500" : "bg-neutral-300"}`} />
                  <div>
                    <dt className="text-xs text-muted">Status</dt>
                    <dd className="font-medium">{exp.isCurrent ? "Currently working here" : "Completed"}</dd>
                  </div>
                </div>
              </dl>
            </div>

            {skills.length > 0 && (
              <div className="rounded-2xl border border-border bg-white p-5">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                  Skills ({skills.length})
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s) => (
                    <span key={s} className="badge text-[11px]">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {exp.documentations.length > 0 && (
              <div className="rounded-2xl border border-border bg-white p-5">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                  Docs ({exp.documentations.length})
                </h3>
                <div className="space-y-1.5">
                  {exp.documentations.map((d) => (
                    <div key={d.id} className="flex items-center gap-2 text-sm">
                      <span className="text-muted">{DOC_TYPE_ICON[d.type] ?? <Link2 size={12} />}</span>
                      {d.url ? (
                        <a href={d.url} target="_blank" rel="noreferrer"
                          className="truncate text-muted hover:text-foreground hover:underline underline-offset-2">
                          {d.title}
                        </a>
                      ) : (
                        <span className="truncate text-muted">{d.title}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
