"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { cn } from "@/lib/utils";

type Project = {
  slug: string;
  title: string;
  summary?: string | null;
  coverImage?: string | null;
  year?: number | null;
  featured?: boolean;
  category?: string | null;
  stakeholders?: Array<{ id: string; name: string; logoUrl?: string | null }>;
};

const PROJECT_LIMIT = 6;

export function FilteredProjects({ projects }: { projects: Project[] }) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.category && p.category.trim()) set.add(p.category.trim());
    });
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [projects]);

  const [active, setActive] = useState<string>("all");
  const [expanded, setExpanded] = useState(false);

  const filtered = useMemo(() => {
    if (active === "all") return projects;
    return projects.filter((p) => (p.category || "").toLowerCase() === active.toLowerCase());
  }, [active, projects]);

  const visible = expanded ? filtered : filtered.slice(0, PROJECT_LIMIT);
  const showToggle = filtered.length > PROJECT_LIMIT;

  if (projects.length === 0) {
    return <p className="text-sm text-muted">No published projects yet.</p>;
  }

  if (categories.length <= 1) {
    return (
      <div className="space-y-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
        {showToggle && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className={cn(
                "rounded-full border px-5 py-2 text-xs font-medium transition",
                "border-border bg-white text-muted hover:border-neutral-300 hover:text-foreground"
              )}
            >
              {expanded ? "Show Less" : "Show More Projects"}
            </button>
          </div>
        )}
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
              onClick={() => {
                setActive(cat);
                setExpanded(false);
              }}
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
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} />
            ))}
          </div>
          {showToggle && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className={cn(
                  "rounded-full border px-5 py-2 text-xs font-medium transition",
                  "border-border bg-white text-muted hover:border-neutral-300 hover:text-foreground"
                )}
              >
                {expanded ? "Show Less" : "Show More Projects"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}