import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, FileText, Github } from "lucide-react";
import { getProjectBySlug, hydrateProject } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const raw = await getProjectBySlug(slug);
  if (!raw || raw.status !== "published") notFound();

  const project = hydrateProject(raw);

  return (
    <article>
      <div className="border-b border-border bg-white">
        <div className="container-page py-8 md:py-12">
          <Link
            href="/#portfolio"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-foreground"
          >
            <ArrowLeft size={14} /> Back to portfolio
          </Link>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                {project.year && <span className="badge">{project.year}</span>}
                {project.featured && <span className="badge">Featured</span>}
              </div>
              <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
                {project.title}
              </h1>
              {project.summary && (
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
                  {project.summary}
                </p>
              )}
              <div className="mt-6 flex flex-wrap gap-3">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                  >
                    Live demo <ExternalLink size={14} />
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                  >
                    <Github size={14} /> Source
                  </a>
                )}
              </div>
            </div>

            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-surface">
              {project.coverImage ? (
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width:1024px) 100vw, 40vw"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted">
                  No cover image
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-page section-pad space-y-16">
        {/* Description + stakeholders */}
        <section className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted">
              Project Description
            </p>
            <div className="prose-lite text-base">
              {project.description || "No description provided."}
            </div>
          </div>

          <aside>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted">
              Stakeholders
            </p>
            {project.stakeholders.length === 0 ? (
              <p className="text-sm text-muted">No stakeholders listed.</p>
            ) : (
              <div className="space-y-3">
                {project.stakeholders.map((s) => (
                  <div key={s.id} className="card flex items-center gap-3 p-4">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-border bg-surface">
                      {s.logoUrl ? (
                        <Image
                          src={s.logoUrl}
                          alt={s.name}
                          fill
                          className="object-contain p-1.5"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-muted">
                          {s.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{s.name}</p>
                      {s.role && <p className="text-xs text-muted">{s.role}</p>}
                      {s.website && (
                        <a
                          href={s.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-muted underline-offset-2 hover:underline"
                        >
                          Website
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </section>

        {/* Problem statement */}
        {project.problemStatement && (
          <section>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-muted">
              Problem Statement
            </p>
            <div className="problem-box">
              <p className="text-lg leading-relaxed md:text-xl">{project.problemStatement}</p>
            </div>
          </section>
        )}

        {/* Tech solutions */}
        {project.techSolutions.length > 0 && (
          <section>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-muted">
              Technology Solutions
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {project.techSolutions.map((tech, idx) => (
                <div key={`${tech.title}-${idx}`} className="card p-5">
                  <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold text-white">
                    {idx + 1}
                  </div>
                  <h3 className="font-semibold tracking-tight">{tech.title}</h3>
                  {tech.description && (
                    <p className="mt-2 text-sm leading-relaxed text-muted">{tech.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Documentation */}
        <section>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-muted">
            Documentation
          </p>
          {project.documentations.length === 0 ? (
            <p className="text-sm text-muted">No documentation yet.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {project.documentations.map((doc) => (
                <div key={doc.id} className="card p-5">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-surface text-muted">
                    <FileText size={16} />
                  </div>
                  <h3 className="font-medium">{doc.title}</h3>
                  <p className="mt-1 text-xs uppercase tracking-wide text-muted">{doc.type}</p>
                  {doc.content && (
                    <p className="mt-2 line-clamp-3 text-sm text-muted">{doc.content}</p>
                  )}
                  {doc.url && (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex text-sm font-medium underline-offset-4 hover:underline"
                    >
                      Open resource →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Visualizations */}
        <section>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-muted">
            Visualizations
          </p>
          {project.visualizations.length === 0 ? (
            <p className="text-sm text-muted">No visualization cards yet.</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {project.visualizations.map((viz) => (
                <figure key={viz.id} className="card overflow-hidden group/viz">
                  <div className="relative aspect-[4/3] overflow-hidden bg-surface cursor-zoom-in">
                    {viz.imageUrl ? (
                      <Image
                        src={viz.imageUrl}
                        alt={viz.title}
                        fill
                        className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/viz:scale-[1.15]"
                        sizes="(max-width:768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-muted">
                        No image
                      </div>
                    )}
                  </div>
                  <figcaption className="p-4">
                    <h3 className="font-medium">{viz.title}</h3>
                    {viz.description && (
                      <p className="mt-1 text-sm text-muted">{viz.description}</p>
                    )}
                    {viz.caption && (
                      <p className="mt-2 text-xs italic text-neutral-400">{viz.caption}</p>
                    )}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </section>

        {/* Skills used in this project */}
        {project.skills && project.skills.length > 0 && (
          <section>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-muted">
              Skills & Technologies
            </p>
            <div className="flex flex-wrap gap-2">
              {project.skills.map((ps) => (
                <span
                  key={ps.skill.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
                  {ps.skill.name}
                  <span className="text-[10px] text-muted">({ps.skill.category})</span>
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
