"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Field, FormCard, SubmitButton } from "@/components/admin/FormControls";
import { ImageUpload } from "@/components/admin/ImageUpload";

type Tech = { title: string; description: string };

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tech, setTech] = useState<Tech[]>([{ title: "", description: "" }]);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    summary: "",
    description: "",
    coverImage: "",
    problemStatement: "",
    year: new Date().getFullYear(),
    featured: false,
    status: "published",
    category: "",
    liveUrl: "",
    githubUrl: "",
    sortOrder: 0,
  });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          year: form.year || null,
          category: form.category || null,
          techSolutions: tech.filter((t) => t.title.trim()),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(typeof data.error === "string" ? data.error : "Create failed");
        return;
      }
      const created = await res.json();
      router.push(`/admin/projects/${created.id}`);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormCard
      title="New project"
      description="Create the case study shell. Add stakeholders, docs, and visualizations on the edit page."
      actions={
        <Link href="/admin/projects" className="btn btn-secondary">
          Cancel
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Title">
            <input className="input" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>
          <Field label="Slug" hint="Leave blank to auto-generate">
            <input className="input" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </Field>
          <Field label="Year">
            <input className="input" type="number" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} />
          </Field>
          <Field label="Status">
            <select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </Field>
          <div className="md:col-span-2">
            <ImageUpload
              label="Cover image"
              value={form.coverImage}
              onChange={(url) => setForm({ ...form, coverImage: url })}
              aspect="landscape"
              hint="16:10 ratio works best for project covers"
            />
          </div>
          <Field label="Sort order">
            <input className="input" type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
          </Field>
          <Field label="Live URL">
            <input className="input" value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} />
          </Field>
          <Field label="GitHub URL">
            <input className="input" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} />
          </Field>
          <Field label="Category" hint="e.g. data science, deep learning, iot, web">
            <input className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </Field>
          <div className="md:col-span-2">
            <Field label="Summary">
              <input className="input" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Description">
              <textarea className="textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Problem statement">
              <textarea className="textarea" value={form.problemStatement} onChange={(e) => setForm({ ...form, problemStatement: e.target.value })} />
            </Field>
          </div>
          <div className="flex items-center gap-2 md:col-span-2">
            <input
              id="featured"
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            <label htmlFor="featured" className="text-sm">
              Featured project
            </label>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Technology solutions</h3>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setTech([...tech, { title: "", description: "" }])}
            >
              Add point
            </button>
          </div>
          <div className="space-y-3">
            {tech.map((t, idx) => (
              <div key={idx} className="grid gap-3 rounded-xl border border-border p-4 md:grid-cols-[1fr_1.5fr_auto]">
                <input
                  className="input"
                  placeholder="Title"
                  value={t.title}
                  onChange={(e) => {
                    const next = [...tech];
                    next[idx] = { ...next[idx], title: e.target.value };
                    setTech(next);
                  }}
                />
                <input
                  className="input"
                  placeholder="Description"
                  value={t.description}
                  onChange={(e) => {
                    const next = [...tech];
                    next[idx] = { ...next[idx], description: e.target.value };
                    setTech(next);
                  }}
                />
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => setTech(tech.filter((_, i) => i !== idx))}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <SubmitButton loading={loading}>Create project</SubmitButton>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </form>
    </FormCard>
  );
}
