"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  ExternalLink,
  Trophy,
  X,
} from "lucide-react";

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
  onOpen,
}: {
  achievement: Achievement;
  index: number;
  onOpen: (a: Achievement) => void;
}) {
  const issuedDate = achievement.issuedAt
    ? new Date(achievement.issuedAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(achievement)}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-neutral-200/70 bg-gradient-to-br from-white via-white to-neutral-50/80 p-6 text-left transition-all duration-300 hover:border-neutral-300 hover:shadow-2xl hover:shadow-neutral-200/60"
    >
      {/* Decorative gradient orb */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-neutral-100/80 to-transparent opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

      {/* Subtle index watermark */}
      <span className="pointer-events-none absolute right-5 top-4 text-5xl font-bold leading-none text-neutral-100/80 transition-colors duration-300 group-hover:text-neutral-200/80">
        {String(index + 1).padStart(2, "0")}
     </span>

      <div className="relative flex flex-1 flex-col gap-5">
        {/* Header */}
        <div className="flex items-start gap-4">
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
            <h3 className="text-lg font-bold leading-tight tracking-tight text-foreground">
              {achievement.title}
           </h3>
            {achievement.issuer && (
              <p className="mt-0.5 truncate text-sm font-medium text-muted">
                {achievement.issuer}
             </p>
            )}
         </div>
       </div>

        {/* Description */}
        {achievement.description && (
          <p className="line-clamp-3 text-sm leading-relaxed text-neutral-600">
            {achievement.description}
         </p>
        )}

        {/* Project link preview */}
        {achievement.project && (
          <div className="mt-auto flex items-center gap-2 rounded-2xl border border-neutral-200/60 bg-white/60 px-3 py-2 backdrop-blur-sm">
            {achievement.project.coverImage && (
              <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-lg border border-neutral-200/80">
                <Image
                  src={achievement.project.coverImage}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="28px"
                  unoptimized
                />
             </span>
            )}
            <span className="min-w-0 flex-1 truncate text-xs font-medium text-muted">
              Linked to {achievement.project.title}
           </span>
            <ArrowRight
              size={13}
              className="shrink-0 text-neutral-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-foreground"
            />
         </div>
        )}

        {/* Tap hint */}
        <span className="mt-1 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-400 transition-colors group-hover:text-foreground">
          Tap to view details
          <ArrowRight size={10} className="transition-transform group-hover:translate-x-0.5" />
       </span>
     </div>
   </motion.button>
  );
}

function AchievementModal({
  achievement,
  onClose,
}: {
  achievement: Achievement | null;
  onClose: () => void;
}) {
  // Lock body scroll when open
  useEffect(() => {
    if (achievement) {
      document.body.style.overflow = "hidden";
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", onKey);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", onKey);
      };
    }
  }, [achievement, onClose]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[80] flex items-end justify-center bg-neutral-900/60 backdrop-blur-md sm:items-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-t-3xl border border-neutral-200/60 bg-white shadow-2xl sm:rounded-3xl"
          >
            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white/90 text-foreground shadow-sm backdrop-blur-sm transition-all hover:rotate-90 hover:border-neutral-300"
              aria-label="Close"
            >
              <X size={16} />
           </button>

            <div className="max-h-[92vh] overflow-y-auto">
              {/* Hero image */}
              {achievement.imageUrl && (
                <div className="relative aspect-[16/9] w-full bg-neutral-100">
                  <Image
                    src={achievement.imageUrl}
                    alt={achievement.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 720px"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  {achievement.logoUrl && (
                    <div className="absolute bottom-4 left-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-white/80 bg-white shadow-xl">
                      <Image
                        src={achievement.logoUrl}
                        alt={achievement.issuer || achievement.title}
                        fill
                        className="object-contain p-2"
                        sizes="56px"
                        unoptimized
                      />
                   </div>
                  )}
               </div>
              )}

              <div className="space-y-6 p-7 md:p-9">
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-2">
                  {achievement.category && (
                    <span className="inline-flex items-center rounded-full bg-neutral-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                      {achievement.category}
                   </span>
                  )}
                  {achievement.issuedAt && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11px] font-medium text-muted">
                      <Calendar size={11} />
                      {new Date(achievement.issuedAt).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                   </span>
                  )}
               </div>

                <div>
                  <h2 className="text-2xl font-bold leading-tight tracking-tight text-foreground md:text-3xl">
                    {achievement.title}
                 </h2>
                  {achievement.issuer && (
                    <p className="mt-1 text-base font-medium text-muted">
                      {achievement.issuer}
                   </p>
                  )}
               </div>

                {/* Description */}
                {achievement.description && (
                  <p className="text-base leading-relaxed text-neutral-600">
                    {achievement.description}
                 </p>
                )}

                {/* Linked project */}
                {achievement.project && (
                  <Link
                    href={`/projects/${achievement.project.slug}`}
                    onClick={onClose}
                    className="group/link flex items-center gap-4 overflow-hidden rounded-2xl border border-neutral-200 bg-gradient-to-br from-neutral-50 to-white p-4 transition-all hover:border-neutral-300 hover:shadow-lg"
                  >
                    {achievement.project.coverImage && (
                      <span className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border border-neutral-200/80">
                        <Image
                          src={achievement.project.coverImage}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="80px"
                          unoptimized
                        />
                     </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                        Featured Project
                     </p>
                      <p className="mt-0.5 truncate font-semibold text-foreground">
                        {achievement.project.title}
                     </p>
                      {achievement.project.category && (
                        <p className="mt-0.5 text-xs text-muted">
                          {achievement.project.category}
                       </p>
                      )}
                   </div>
                    <ArrowRight
                      size={18}
                      className="shrink-0 text-neutral-400 transition-all duration-300 group-hover/link:translate-x-1 group-hover/link:text-foreground"
                    />
                 </Link>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2 border-t border-neutral-100 pt-2">
                  {achievement.credentialUrl && (
                    <a
                      href={achievement.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-neutral-800 hover:shadow-md"
                    >
                      <ExternalLink size={14} />
                      Verify credential
                   </a>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-neutral-300 hover:bg-neutral-50"
                  >
                    Close
                 </button>
               </div>
             </div>
           </div>
         </motion.div>
       </motion.div>
      )}
   </AnimatePresence>
  );
}

export function AchievementShowcase({ items }: { items: Achievement[] }) {
  const [active, setActive] = useState<Achievement | null>(null);

  if (!items.length) return null;

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((achievement, i) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            index={i}
            onOpen={setActive}
          />
        ))}
     </div>

      <AchievementModal achievement={active} onClose={() => setActive(null)} />
    </>
  );
}
