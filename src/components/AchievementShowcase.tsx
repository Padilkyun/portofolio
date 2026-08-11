"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Award, ExternalLink, Calendar, ArrowRight } from "lucide-react";

type AchievementProject = {
  slug: string;
  title: string;
  coverImage?: string | null;
  category?: string | null;
};

type Achievement = {
  id: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  issuer?: string | null;
  issuedAt?: Date | string | null;
  credentialUrl?: string | null;
  category?: string | null;
  project?: AchievementProject | null;
};

function AchievementCard({
  achievement,
  index,
}: {
  achievement: Achievement;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const isEven = index % 2 === 0;

  const issuedDate = achievement.issuedAt
    ? new Date(achievement.issuedAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <div className="group relative overflow-hidden rounded-2xl border border-border bg-white transition-all duration-300 hover:border-neutral-300 hover:shadow-xl">
        {/* Subtle gradient accent at top */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-neutral-200 via-neutral-400 to-neutral-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}>
          {/* Certificate visual — the "seal" side */}
          <div className="relative flex shrink-0 items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 p-6 md:w-56 md:p-8">
            {/* Decorative circles */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full border border-neutral-200/60" />
              <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full border border-neutral-200/40" />
            </div>

            <div className="relative">
              {achievement.imageUrl ? (
                <motion.div
                  whileHover={{ rotate: 0, scale: 1.05 }}
                  initial={{ rotate: isEven ? -3 : 3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative h-32 w-40 overflow-hidden rounded-lg border border-neutral-200/80 bg-white shadow-lg"
                >
                  <Image
                    src={achievement.imageUrl}
                    alt={achievement.title}
                    fill
                    className="object-contain p-2"
                    sizes="160px"
                    unoptimized
                  />
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{ rotate: 0, scale: 1.05 }}
                  initial={{ rotate: isEven ? -3 : 3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex h-32 w-40 items-center justify-center rounded-lg border border-neutral-200/80 bg-white shadow-lg"
                >
                  <Award size={36} className="text-neutral-300" />
                </motion.div>
              )}

              {/* Small seal badge */}
              {achievement.issuer && (
                <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-[9px] font-bold text-white shadow-md">
                  {achievement.issuer.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* Content side */}
          <div className="flex flex-1 flex-col justify-center p-5 md:p-6">
            {/* Category + date row */}
            <div className="mb-2.5 flex flex-wrap items-center gap-2">
              {achievement.category && (
                <span className="inline-flex items-center rounded-full bg-neutral-900/5 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-neutral-600">
                  {achievement.category}
                </span>
              )}
              {issuedDate && (
                <span className="inline-flex items-center gap-1 text-[11px] text-muted">
                  <Calendar size={10} />
                  {issuedDate}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-base font-semibold leading-snug tracking-tight text-foreground">
              {achievement.title}
            </h3>

            {/* Issuer */}
            {achievement.issuer && (
              <p className="mt-0.5 text-sm font-medium text-muted">
                {achievement.issuer}
              </p>
            )}

            {/* Description */}
            {achievement.description && (
              <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-neutral-500">
                {achievement.description}
              </p>
            )}

            {/* Action links */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {achievement.credentialUrl && (
                <a
                  href={achievement.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-muted transition hover:text-foreground"
                >
                  <ExternalLink size={11} />
                  View credential
                </a>
              )}

              {achievement.project && (
                <Link
                  href={`/projects/${achievement.project.slug}`}
                  className="group/link inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-neutral-700 transition-all hover:border-neutral-300 hover:bg-neutral-100 hover:text-foreground"
                >
                  {achievement.project.coverImage && (
                    <span className="relative h-4 w-4 shrink-0 overflow-hidden rounded-full border border-border">
                      <Image
                        src={achievement.project.coverImage}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="16px"
                        unoptimized
                      />
                    </span>
                  )}
                  <span className="truncate max-w-[140px]">
                    {achievement.project.title}
                  </span>
                  <ArrowRight
                    size={10}
                    className="transition-transform group-hover/link:translate-x-0.5"
                  />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function AchievementShowcase({ items }: { items: Achievement[] }) {
  if (!items.length) return null;

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {items.map((achievement, i) => (
        <AchievementCard key={achievement.id} achievement={achievement} index={i} />
      ))}
    </div>
  );
}
