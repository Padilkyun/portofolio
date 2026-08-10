"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";

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

export function FilteredProjects({ projects }: { projects: Project[] }) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.category && p.category.trim()) set.add(p.category.trim());
    });
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [projects]);

  const [active, setActive] = useState<string>("all");

  const filtered = useMemo(() => {
    if (active === "all") return projects;
    return projects.filter((p) => (p.category || "").toLowerCase() === active.toLowerCase());
  }, [active, projects]);

  if (projects.length === 0) {
    return <p className="text-sm text-muted">No published projects yet.</p>;
  }

  if (categories.length <= 1) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
                  {projects.filter((p) => (p.category || "").toLowerCase() === cat.toLowerCase()).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted">No projects in this category yet.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
