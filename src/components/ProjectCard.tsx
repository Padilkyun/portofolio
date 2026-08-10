"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

type Project = {
  slug: string;
  title: string;
  summary?: string | null;
  coverImage?: string | null;
  year?: number | null;
  featured?: boolean;
  category?: string | null;
  stakeholders?: Array<{ name: string; logoUrl?: string | null }>;
};

export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/projects/${project.slug}`} className="group block">
        <motion.div
          whileHover={{ y: -5 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="card overflow-hidden"
        >
          {/* Cover image */}
          <div className="relative aspect-[16/10] overflow-hidden bg-surface">
            {project.coverImage ? (
              <Image
                src={project.coverImage}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                sizes="(max-width:768px) 100vw, 33vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted">
                No cover
              </div>
            )}

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-neutral-900/0 transition-colors duration-300 group-hover:bg-neutral-900/10" />

            {/* Featured badge on top-left */}
            {project.featured && (
              <span className="absolute left-3 top-3 rounded-full bg-neutral-900/80 px-2.5 py-1 text-[10px] font-medium tracking-wide text-white backdrop-blur-sm">
                Featured
              </span>
            )}

            {/* Arrow icon top-right */}
            <div className="absolute right-3 top-3 flex h-8 w-8 translate-y-1 items-center justify-center rounded-full bg-white/0 opacity-0 shadow-sm transition-all duration-300 group-hover:translate-y-0 group-hover:bg-white group-hover:opacity-100">
              <ArrowUpRight size={14} className="text-neutral-800" />
            </div>
          </div>

          {/* Body */}
          <div className="p-5">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {project.year && (
                <span className="badge text-[11px]">{project.year}</span>
              )}
              {project.category && (
                <span className="badge text-[11px] bg-neutral-900/5 text-neutral-700">
                  {project.category}
                </span>
              )}
            </div>

            <h3 className="text-base font-semibold tracking-tight transition-colors group-hover:text-neutral-600">
              {project.title}
            </h3>

            {project.summary && (
              <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">
                {project.summary}
              </p>
            )}

            {/* Stakeholders */}
            {project.stakeholders && project.stakeholders.length > 0 && (
              <div className="mt-4 flex items-center gap-2">
                <div className="flex -space-x-2">
                  {project.stakeholders.slice(0, 3).map((s) => (
                    <div
                      key={s.name}
                      className="relative h-6 w-6 overflow-hidden rounded-full border-2 border-white bg-white shadow-sm"
                      title={s.name}
                    >
                      {s.logoUrl ? (
                        <Image
                          src={s.logoUrl}
                          alt={s.name}
                          fill
                          className="object-contain p-0.5"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-[8px] font-semibold text-muted">
                          {s.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {project.stakeholders.length > 3 && (
                  <span className="text-[11px] text-muted">
                    +{project.stakeholders.length - 3} more
                  </span>
                )}
                {project.stakeholders.length <= 3 && (
                  <span className="text-[11px] text-muted">
                    {project.stakeholders.map((s) => s.name).join(", ")}
                  </span>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
