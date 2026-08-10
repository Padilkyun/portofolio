import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Award,
  BookOpen,
  ExternalLink,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDateRange, parseJsonArray } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BootcampDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bc = await prisma.bootcamp.findUnique({ where: { id } });
  if (!bc) notFound();

  const skills = parseJsonArray<string>(bc.skills);
  const dateRange = formatDateRange(bc.startDate, bc.endDate);

  // Duration
  let duration = "";
  if (bc.startDate && bc.endDate) {
    const start = new Date(bc.startDate);
    const end = new Date(bc.endDate);
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const weeks = Math.round(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 7)
    );
    duration = months >= 1 ? `${months} month${months > 1 ? "s" : ""}` : `${weeks} week${weeks > 1 ? "s" : ""}`;
  }

  return (
    <main className="min-h-screen bg-white">
      {/* ── Hero Header ── */}
      <div className="border-b border-border bg-white">
        <div className="container-page py-10 md:py-14">
          <Link
            href="/#bootcamp"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted transition hover:text-foreground"
          >
            <ArrowLeft size={14} />
            Back to bootcamp
          </Link>

          <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-10">
            {/* Logo */}
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm md:h-24 md:w-24">
              {bc.logoUrl ? (
                <Image
                  src={bc.logoUrl}
                  alt={bc.name}
                  fill
                  className="object-contain p-2.5"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-neutral-900 text-xl font-bold text-white">
                  {bc.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            {/* Title block */}
            <div className="flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {bc.certificateUrl && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
                    <Award size={11} />
                    Certificate Available
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl">
                {bc.name}
              </h1>
              <p className="mt-2 text-lg font-medium text-muted">
                {bc.organizer || "Bootcamp Program"}
              </p>

              {/* Meta pills */}
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted">
                {dateRange && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1">
                    <Calendar size={13} />
                    {dateRange}
                  </span>
                )}
                {duration && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1">
                    <Clock size={13} />
                    {duration}
                  </span>
                )}
                {skills.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1">
                    <BookOpen size={13} />
                    {skills.length} skills covered
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="container-page py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_300px]">

          {/* Left: main content */}
          <div className="space-y-10">

            {/* About */}
            <section>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                About This Program
              </h2>
              <div className="rounded-2xl border border-border bg-surface p-6 md:p-8">
                {bc.description ? (
                  <p className="prose-lite whitespace-pre-wrap text-base leading-relaxed text-neutral-700">
                    {bc.description}
                  </p>
                ) : (
                  <p className="text-sm text-muted">No description provided.</p>
                )}
              </div>
            </section>

            {/* Skills learned */}
            {skills.length > 0 && (
              <section>
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  Skills Covered
                </h2>
                <div className="rounded-2xl border border-border bg-white p-6">
                  <div className="grid gap-2 sm:grid-cols-2">
                    {skills.map((s) => (
                      <div
                        key={s}
                        className="flex items-center gap-2.5 rounded-xl border border-border bg-surface px-4 py-2.5"
                      >
                        <CheckCircle2 size={14} className="shrink-0 text-neutral-400" />
                        <span className="text-sm font-medium">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Certificate CTA */}
            {bc.certificateUrl && (
              <section>
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  Certificate
                </h2>
                <div className="flex flex-col gap-4 rounded-2xl border border-border bg-neutral-950 p-6 text-white md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                      <Award size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">Completion Certificate</p>
                      <p className="text-sm text-neutral-400">{bc.organizer || bc.name}</p>
                    </div>
                  </div>
                  <a
                    href={bc.certificateUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn bg-white text-neutral-900 hover:bg-neutral-100"
                  >
                    <ExternalLink size={14} />
                    View Certificate
                  </a>
                </div>
              </section>
            )}
          </div>

          {/* Right: sidebar */}
          <aside className="space-y-4">
            {/* Program info card */}
            <div className="rounded-2xl border border-border bg-white p-5">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                Program Info
              </h3>
              <dl className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <BookOpen size={14} className="mt-0.5 shrink-0 text-muted" />
                  <div>
                    <dt className="text-xs text-muted">Program</dt>
                    <dd className="font-medium">{bc.name}</dd>
                  </div>
                </div>
                {bc.organizer && (
                  <div className="flex items-start gap-2">
                    <Award size={14} className="mt-0.5 shrink-0 text-muted" />
                    <div>
                      <dt className="text-xs text-muted">Organizer</dt>
                      <dd className="font-medium">{bc.organizer}</dd>
                    </div>
                  </div>
                )}
                {dateRange && (
                  <div className="flex items-start gap-2">
                    <Calendar size={14} className="mt-0.5 shrink-0 text-muted" />
                    <div>
                      <dt className="text-xs text-muted">Period</dt>
                      <dd className="font-medium">{dateRange}</dd>
                    </div>
                  </div>
                )}
                {duration && (
                  <div className="flex items-start gap-2">
                    <Clock size={14} className="mt-0.5 shrink-0 text-muted" />
                    <div>
                      <dt className="text-xs text-muted">Duration</dt>
                      <dd className="font-medium">{duration}</dd>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-muted" />
                  <div>
                    <dt className="text-xs text-muted">Certificate</dt>
                    <dd className="font-medium">{bc.certificateUrl ? "Issued" : "Not available"}</dd>
                  </div>
                </div>
              </dl>
            </div>

            {/* Skills quick-view */}
            {skills.length > 0 && (
              <div className="rounded-2xl border border-border bg-white p-5">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                  Skills ({skills.length})
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s) => (
                    <span key={s} className="badge text-[11px]">
                      {s}
                    </span>
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
