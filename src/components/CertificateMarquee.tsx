"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Award, ExternalLink, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

type CertificateProject = {
  slug: string;
  title: string;
};

type Certificate = {
  id: string;
  title: string;
  imageUrl?: string | null;
  issuer?: string | null;
  issuedAt?: Date | string | null;
  credentialUrl?: string | null;
  category?: string | null;
  project?: CertificateProject | null;
};

function CertificateTile({ cert }: { cert: Certificate }) {
  return (
    <a
      href={cert.credentialUrl || "#"}
      target={cert.credentialUrl ? "_blank" : undefined}
      rel={cert.credentialUrl ? "noreferrer" : undefined}
      className={cn(
        "group/cert relative block shrink-0 overflow-hidden rounded-2xl border border-neutral-200/70 bg-white shadow-sm transition-all duration-500",
        "hover:border-neutral-300 hover:shadow-2xl hover:shadow-neutral-200/50",
        cert.credentialUrl ? "cursor-pointer" : "cursor-default"
      )}
      style={{ width: "320px" }}
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-neutral-100 via-neutral-50 to-neutral-100">
        {cert.imageUrl ? (
          <Image
            src={cert.imageUrl}
            alt={cert.title}
            fill
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/cert:scale-[1.08]"
            sizes="320px"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Award size={48} className="text-neutral-300" />
         </div>
        )}

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-60 transition-opacity duration-500 group-hover/cert:opacity-90" />

        {/* Category badge top-right */}
        {cert.category && (
          <span className="absolute right-3 top-3 z-10 inline-flex items-center rounded-full border border-white/30 bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground backdrop-blur-sm">
            {cert.category}
         </span>
        )}

        {/* Hover overlay content */}
        <div className="absolute inset-x-0 bottom-0 z-10 translate-y-3 px-4 pb-4 opacity-0 transition-all duration-500 group-hover/cert:translate-y-0 group-hover/cert:opacity-100">
          <p className="line-clamp-2 text-base font-bold leading-tight text-white drop-shadow">
            {cert.title}
         </p>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            {cert.issuer && (
              <p className="truncate text-xs font-medium text-white/85">
                {cert.issuer}
             </p>
            )}
            {cert.credentialUrl && (
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/95 text-foreground shadow-md transition-transform duration-300 group-hover/cert:scale-110">
                <ExternalLink size={12} />
             </span>
            )}
         </div>
       </div>
     </div>

      {/* Always-visible bottom info */}
      <div className="px-4 py-3 transition-opacity duration-300 group-hover/cert:opacity-0">
        <p className="line-clamp-1 text-sm font-semibold text-foreground">
          {cert.title}
       </p>
        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted">
          {cert.issuer && <span className="truncate">{cert.issuer}</span>}
          {cert.issuer && cert.issuedAt && <span className="opacity-50">·</span>}
          {cert.issuedAt && (
            <span className="shrink-0">
              {new Date(cert.issuedAt).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
           </span>
          )}
       </div>
     </div>
   </a>
  );
}

export function CertificateMarquee({ items }: { items: Certificate[] }) {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((c) => {
      if (c.category && c.category.trim()) set.add(c.category.trim());
    });
    return ["all", ...Array.from(set).sort()];
  }, [items]);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return items;
    return items.filter((c) => (c.category || "").toLowerCase() === activeFilter.toLowerCase());
  }, [items, activeFilter]);

  if (!items.length) return null;

  // Split into two rows for visual rhythm
  const half = Math.ceil(filtered.length / 2);
  const row1 = filtered.slice(0, half);
  const row2 = filtered.slice(half);
  const row1Doubled = row1.length > 0 ? [...row1, ...row1] : [];
  const row2Doubled = row2.length > 0 ? [...row2, ...row2] : [];

  return (
    <div className="space-y-6">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 pr-2 text-xs font-medium text-muted">
          <Filter size={12} />
          <span className="uppercase tracking-wider">Filter</span>
       </div>
        {categories.map((cat) => {
          const isActive = activeFilter === cat;
          const count =
            cat === "all"
              ? items.length
              : items.filter((c) => (c.category || "").toLowerCase() === cat.toLowerCase()).length;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveFilter(cat)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200",
                isActive
                  ? "border-neutral-900 bg-neutral-900 text-white shadow-sm"
                  : "border-neutral-200 bg-white text-foreground/70 hover:border-neutral-300 hover:text-foreground"
              )}
            >
              {cat === "all" ? "All" : cat}
              <span
                className={cn(
                  "ml-1.5 opacity-70",
                  isActive && "text-white/80"
                )}
              >
                {count}
             </span>
           </button>
          );
        })}
        {filtered.length > 0 && (
          <span className="ml-auto text-xs text-muted">
            {filtered.length} {filtered.length === 1 ? "certificate" : "certificates"}
         </span>
        )}
     </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-10 text-center">
          <Award size={32} className="mx-auto mb-3 text-neutral-300" />
          <p className="text-sm text-muted">No certificates in this category yet</p>
       </div>
      ) : (
        <>
          {/* Row 1 — scroll left */}
          {row1.length > 0 && (
            <div className="relative overflow-hidden">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />

              <div
                className="flex gap-5"
                style={{
                  animation: "marquee-scroll-left 50s linear infinite",
                  width: "max-content",
                }}
              >
                {row1Doubled.map((cert, i) => (
                  <CertificateTile key={`r1-${cert.id}-${i}`} cert={cert} />
                ))}
             </div>
           </div>
          )}

          {/* Row 2 — scroll right (opposite direction) */}
          {row2.length > 0 && (
            <div className="relative overflow-hidden">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />

              <div
                className="flex gap-5"
                style={{
                  animation: "marquee-scroll-right 55s linear infinite",
                  width: "max-content",
                }}
              >
                {row2Doubled.map((cert, i) => (
                  <CertificateTile key={`r2-${cert.id}-${i}`} cert={cert} />
                ))}
             </div>
           </div>
          )}
        </>
      )}
   </div>
  );
}
