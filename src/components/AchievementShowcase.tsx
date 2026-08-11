"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Calendar, ArrowRight, Trophy } from "lucide-react";

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
  logoUrl?: string | null;
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
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const issuedDate = achievement.issuedAt
    ? new Date(achievement.issuedAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <div className="group relative overflow-hidden rounded-3xl border border-neutral-200/60 bg-gradient-to-br from-white via-white to-neutral-50/80 p-6 transition-all duration-300 hover:border-neutral-300 hover:shadow-2xl hover:shadow-neutral-200/50">
        {/* Decorative gradient orb */}
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-neutral-100 to-transparent opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

        <div className="relative flex flex-col gap-5">
          {/* Header: Logo + Title + Meta */}
          <div className="flex items-start gap-4">
            {/* Logo badge */}
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-neutral-200/80 bg-gradient-to-br from-neutral-50 to-neutral-100 shadow-sm">
              {achievement.logoUrl ? (
                <Image
                  src={achievement.logoUrl}
                  alt={achievement.issuer || achievement.title}
                  fill
                  className="object-contain p-2"
                  sizes="56px"
                  unoptimized
                />
              ) : (
                <Trophy size={24} className="text-neutral-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              {/* Category + Date */}
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                {achievement.category && (
                  <span className="inline-flex items-center rounded-full bg-neutral-900 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                    {achievement.category}
                  </span>
                )}
                {issuedDate && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted">
                    <Calendar size={10} />
                    {issuedDate}
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold leading-tight tracking-tight text-foreground">
                {achievement.title}
              </h3>

              {/* Issuer */}
              {achievement.issuer && (
                <p className="mt-0.5 text-sm font-medium text-muted">
                  {achievement.issuer}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          {achievement.description && (
            <p className="text-sm leading-relaxed text-neutral-600">
              {achievement.description}
            </p>
          )}

          {/* Certificate preview */}
          {achievement.imageUrl && (
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-neutral-200/60 bg-neutral-100">
              <Image
                src={achievement.imageUrl}
                alt={achievement.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
                unoptimized
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {achievement.credentialUrl && (
              <a
                href={achievement.credentialUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-700 transition-all hover:border-neutral-300 hover:bg-neutral-50 hover:shadow-sm"
              >
                <ExternalLink size={12} />
                View Credential
              </a>
            )}

            {achievement.project && (
              <Link
                href={`/projects/${achievement.project.slug}`}
                className="group/link inline-flex items-center gap-2 rounded-full bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white transition-all hover:bg-neutral-800 hover:shadow-md"
              >
                {achievement.project.coverImage && (
                  <span className="relative h-4 w-4 shrink-0 overflow-hidden rounded-full border border-white/20">
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
                  size={11}
                  className="transition-transform group-hover/link:translate-x-0.5"
                />
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function AchievementShowcase({ items }: { items: Achievement[] }) {
  if (!items.length) return null;

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((achievement, i) => (
        <AchievementCard key={achievement.id} achievement={achievement} index={i} />
      ))}
    </div>
  );
}
