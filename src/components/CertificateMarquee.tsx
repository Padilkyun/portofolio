"use client";

import Image from "next/image";
import { useRef, useEffect, useState, useMemo } from "react";
import { Award, ExternalLink } from "lucide-react";

type Certificate = {
  id: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  issuer?: string | null;
  issuedAt?: Date | string | null;
  credentialUrl?: string | null;
};

function CertCard({ cert }: { cert: Certificate }) {
  return (
    <div className="group relative mx-3 w-56 shrink-0 overflow-hidden rounded-2xl border border-border bg-neutral-100 shadow-sm transition-all duration-300 hover:shadow-xl md:w-64">
      {/* Full image — no footer */}
      <div className="relative aspect-[4/3] w-full bg-white">
        {cert.imageUrl ? (
          <Image
            src={cert.imageUrl}
            alt={cert.title}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="256px"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
            <Award size={40} className="text-neutral-300" />
          </div>
        )}

        {/* Overlay slides up from bottom on hover */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-neutral-950/95 via-neutral-950/60 to-transparent p-5 translate-y-2 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <p className="text-sm font-semibold leading-snug text-white">
            {cert.title}
          </p>
          {cert.issuer && (
            <p className="mt-1 text-[11px] font-medium text-neutral-400">{cert.issuer}</p>
          )}
          {cert.issuedAt && (
            <p className="mt-0.5 text-[11px] text-neutral-500">
              {new Date(cert.issuedAt).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </p>
          )}
          {cert.description && (
            <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-neutral-300">
              {cert.description}
            </p>
          )}
          {cert.credentialUrl && (
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <ExternalLink size={10} /> View credential
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({
  certs,
  reverse = false,
  speed = 35,
}: {
  certs: Certificate[];
  reverse?: boolean;
  speed?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(speed);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const totalWidth = track.scrollWidth / 2;
    setDuration(totalWidth / speed);
  }, [certs, speed]);

  const doubled = [...certs, ...certs];

  // Build full animation shorthand to avoid shorthand/longhand React conflict
  // format: name duration timing-function delay iteration-count direction fill-mode
  const animationValue = `marquee-scroll ${duration}s linear infinite ${reverse ? "reverse" : "normal"}`;

  return (
    <div className="relative overflow-hidden">
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" />

      <div
        ref={trackRef}
        className="flex w-max py-2"
        style={{ animation: animationValue, willChange: "transform" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.animationPlayState = "paused";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.animationPlayState = "running";
        }}
      >
        {doubled.map((cert, i) => (
          <CertCard key={`${cert.id}-${i}`} cert={cert} />
        ))}
      </div>
    </div>
  );
}

export function CertificateMarquee({ items }: { items: Certificate[] }) {
  // categories based on issuer (or use category if added later)
  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((c) => {
      if (c.issuer && c.issuer.trim()) set.add(c.issuer.trim());
    });
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [items]);

  const [active, setActive] = useState<string>("all");

  const filtered = useMemo(() => {
    if (active === "all") return items;
    return items.filter((c) => (c.issuer || "").toLowerCase() === active.toLowerCase());
  }, [active, items]);

  if (!items.length) return null;

  // Always show two rows from filtered, both filled to at least 5 items
  const fill = (arr: Certificate[]) => {
    if (arr.length === 0) return [];
    let out = [...arr];
    while (out.length < 5) out = [...out, ...arr];
    return out;
  };

  const row1 = fill(filtered.filter((_, i) => i % 2 === 0));
  // If only 1 filtered item, reuse it in row2 so two rows always show
  const row2 = fill(filtered.length === 1 ? filtered : filtered.filter((_, i) => i % 2 === 1));

  return (
    <div className="space-y-4">
      {/* Category filter buttons */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const isActive = active === cat;
          const label = cat === "all" ? "All" : cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                isActive
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-border bg-white text-muted hover:border-neutral-300 hover:text-foreground"
              }`}
            >
              {label}
              {cat !== "all" && (
                <span className="ml-1.5 opacity-60">
                  {items.filter((c) => (c.issuer || "").toLowerCase() === cat.toLowerCase()).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted">No certificates in this category yet.</p>
      ) : (
        <>
          <MarqueeRow certs={row1} reverse={false} speed={40} />
          <MarqueeRow certs={row2} reverse={true} speed={38} />
        </>
      )}
    </div>
  );
}

