"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { formatDateRange, parseJsonArray } from "@/lib/utils";
import { Calendar, MapPin, ExternalLink } from "lucide-react";

export type Experience = {
  id: string;
  company: string;
  role: string;
  location?: string | null;
  startDate: Date | string;
  endDate?: Date | string | null;
  isCurrent: boolean;
  description?: string | null;
  logoUrl?: string | null;
};

export type Bootcamp = {
  id: string;
  name: string;
  organizer?: string | null;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  description?: string | null;
  certificateUrl?: string | null;
  logoUrl?: string | null;
  skills: string;
};

function TimelineItem({
  item,
  type,
  index,
}: {
  item: Experience | Bootcamp;
  type: "work" | "bootcamp";
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const isLeft = index % 2 === 0; // even → left, odd → right

  const isExp = type === "work";
  const title = isExp ? (item as Experience).role : (item as Bootcamp).name;
  const subtitle = isExp
    ? (item as Experience).company
    : (item as Bootcamp).organizer || "Bootcamp";
  const location = isExp ? (item as Experience).location : null;
  const isCurrent = isExp ? (item as Experience).isCurrent : false;
  const dateRange = formatDateRange(item.startDate, item.endDate, isCurrent);
  const skills = !isExp ? parseJsonArray<string>((item as Bootcamp).skills) : [];
  const certUrl = !isExp ? (item as Bootcamp).certificateUrl : null;

  return (
    <div ref={ref} className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] md:gap-0">
      {/* LEFT CELL */}
      <div className={`md:pr-10 ${isLeft ? "md:block" : "md:invisible"}`}>
        {isLeft && (
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <CardInner
              item={item}
              title={title}
              subtitle={subtitle}
              location={location}
              dateRange={dateRange}
              skills={skills}
              certUrl={certUrl}
              isCurrent={isCurrent}
              type={type}
              align="right"
            />
          </motion.div>
        )}
      </div>

      {/* CENTER: dot + line segment */}
      <div className="hidden md:flex md:flex-col md:items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.35, delay: 0.15, type: "spring", stiffness: 300 }}
          className="relative z-10 flex h-7 w-7 items-center justify-center"
        >
          <div className={`h-3 w-3 rounded-full ring-4 ring-background ${isCurrent ? "bg-green-500 animate-pulse" : "bg-foreground"}`} />
        </motion.div>
        <div className="w-px flex-1 bg-border" />
      </div>

      {/* RIGHT CELL */}
      <div className={`pl-8 md:pl-10 ${!isLeft ? "md:block" : "md:invisible"} mt-0`}>
        {!isLeft && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <CardInner
              item={item}
              title={title}
              subtitle={subtitle}
              location={location}
              dateRange={dateRange}
              skills={skills}
              certUrl={certUrl}
              isCurrent={isCurrent}
              type={type}
              align="left"
            />
          </motion.div>
        )}
      </div>

      {/* Mobile: full-width card (shown below dot on mobile) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45 }}
        className="mt-3 pl-8 md:hidden"
      >
        <CardInner
          item={item}
          title={title}
          subtitle={subtitle}
          location={location}
          dateRange={dateRange}
          skills={skills}
          certUrl={certUrl}
          isCurrent={isCurrent}
          type={type}
          align="left"
        />
      </motion.div>
    </div>
  );
}

function CardInner({
  item,
  title,
  subtitle,
  location,
  dateRange,
  skills,
  certUrl,
  isCurrent,
  type,
  align,
}: {
  item: Experience | Bootcamp;
  title: string;
  subtitle: string;
  location: string | null | undefined;
  dateRange: string;
  skills: string[];
  certUrl: string | null | undefined;
  isCurrent: boolean;
  type: "work" | "bootcamp";
  align: "left" | "right";
}) {
  const href = `/${type === "work" ? "work" : "bootcamp"}/${item.id}`;

  return (
    <Link href={href} className="group block">
      <motion.div
        whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(0,0,0,0.07)" }}
        transition={{ duration: 0.2 }}
        className={`card p-5 md:p-6 ${align === "right" ? "md:text-right" : ""}`}
      >
        {/* Logo + title row */}
        <div
          className={`mb-3 flex items-start gap-3 ${align === "right" ? "md:flex-row-reverse" : ""}`}
        >
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-border bg-surface">
            {"logoUrl" in item && item.logoUrl ? (
              <Image
                src={(item as { logoUrl?: string | null }).logoUrl!}
                alt={title}
                fill
                className="object-contain p-1.5"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-bold text-muted">
                {title.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className={`flex flex-wrap items-center gap-2 ${align === "right" ? "md:justify-end" : ""}`}>
              <h3 className="font-semibold tracking-tight leading-snug">{title}</h3>
              {isCurrent && (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700 ring-1 ring-green-200">
                  <span className="h-1 w-1 rounded-full bg-green-500 animate-pulse" />
                  Current
                </span>
              )}
            </div>
            <p className="mt-0.5 text-sm font-medium text-muted">{subtitle}</p>
          </div>
        </div>

        {/* Meta: date + location */}
        <div
          className={`mb-3 flex flex-wrap gap-3 text-xs text-muted ${align === "right" ? "md:justify-end" : ""}`}
        >
          {dateRange && (
            <span className="inline-flex items-center gap-1">
              <Calendar size={11} />
              {dateRange}
            </span>
          )}
          {location && (
            <span className="inline-flex items-center gap-1">
              <MapPin size={11} />
              {location}
            </span>
          )}
        </div>

        {/* Description */}
        {item.description && (
          <p className="prose-lite text-sm line-clamp-3">{item.description}</p>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div
            className={`mt-3 flex flex-wrap gap-1.5 ${align === "right" ? "md:justify-end" : ""}`}
          >
            {skills.slice(0, 5).map((s) => (
              <span key={s} className="badge text-[11px]">
                {s}
              </span>
            ))}
            {skills.length > 5 && (
              <span className="badge text-[11px] text-neutral-400">+{skills.length - 5}</span>
            )}
          </div>
        )}

        {/* Certificate link */}
        {certUrl && (
          <div className={`mt-3 ${align === "right" ? "md:text-right" : ""}`}>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-neutral-500 transition group-hover:text-foreground">
              <ExternalLink size={11} />
              View Certificate
            </span>
          </div>
        )}
      </motion.div>
    </Link>
  );
}

export function Timeline({
  items,
  type,
}: {
  items: Experience[] | Bootcamp[];
  type: "work" | "bootcamp";
}) {
  if (!items.length) {
    return (
      <p className="text-sm text-muted">
        {type === "work" ? "No work experience yet." : "No bootcamp experience yet."}
      </p>
    );
  }

  return (
    <div className="relative">
      {/* Vertical rail — desktop only, behind the dot column */}
      <div className="absolute hidden md:block" style={{ left: "50%", top: 0, bottom: 0, width: 1, background: "var(--border)", transform: "translateX(-50%)" }} />

      <div className="space-y-6 md:space-y-0">
        {items.map((item, i) => (
          <TimelineItem key={item.id} item={item} type={type} index={i} />
        ))}
      </div>
    </div>
  );
}
