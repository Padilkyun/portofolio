"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DeleteButton, Field, FormCard, SubmitButton } from "@/components/admin/FormControls";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { parseJsonArray } from "@/lib/utils";

type Tech = { title: string; description?: string };
type Nested = {
  id: string;
  name?: string;
  title?: string;
  role?: string | null;
  logoUrl?: string | null;
  website?: string | null;
  type?: string;
  url?: string | null;
  content?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  caption?: string | null;
};

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [tech, setTech] = useState<Tech[]>([{ title: "", description: "" }]);
  const [stakeholders, setStakeholders] = useState<Nested[]>([]);
  const [docs, setDocs] = useState<Nested[]>([]);
  const [viz, setViz] = useState<Nested[]>([]);
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
    liveUrl: "",
    githubUrl: "",
    category: "",
    sortOrder: 0,
  });

  const [stakeForm, setStakeForm] = useState({ name: "", role: "", logoUrl: "", website: "" });
  const [docForm, setDocForm] = useState({ title: "", type: "link", url: "", content: "" });
  const [vizForm, setVizForm] = useState({ title: "", description: "", imageUrl: "", caption: "" });

  async function load() {
    const res = await fetch(`/api/projects/${id}`);
    if (!res.ok) return;
    const data = await res.json();
    setForm({
      title: data.title || "",
      slug: data.slug || "",
      summary: data.summary || "",
      description: data.description || "",
      coverImage: data.coverImage || "",
      problemStatement: data.problemStatement || "",
      year: data.year || new Date().getFullYear(),
      featured: Boolean(data.featured),
      status: data.status || "published",
      liveUrl: data.liveUrl || "",
      githubUrl: data.githubUrl || "",
      category: data.category || "",
      sortOrder: data.sortOrder || 0,
    });
    const parsed = parseJsonArray<Tech>(data.techSolutions);
    setTech(parsed.length ? parsed : [{ title: "", description: "" }]);
    setStakeholders(data.stakeholders || []);
    setDocs(data.documentations || []);
    setViz(data.visualizations || []);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
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
        setError(typeof data.error === "string" ? data.error : "Update failed");
        return;
      }
      setMessage("Project saved.");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function addStakeholder(e: FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/projects/${id}/stakeholders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stakeForm),
    });
    if (res.ok) {
      setStakeForm({ name: "", role: "", logoUrl: "", website: "" });
      await load();
    }
  }

  async function addDoc(e: FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/projects/${id}/documentations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(docForm),
    });
    if (res.ok) {
      setDocForm({ title: "", type: "link", url: "", content: "" });
      await load();
    }
  }

  async function addViz(e: FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/projects/${id}/visualizations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vizForm),
    });
    if (res.ok) {
      setVizForm({ title: "", description: "", imageUrl: "", caption: "" });
      await load();
    }
  }

  return (
    <div className="space-y-6">
      <FormCard
        title="Edit project"
        description="Core case study fields."
        actions={
          <div className="flex gap-2">
            <Link href="/admin/projects" className="btn btn-secondary">
              Back
            </Link>
            <Link href={`/projects/${form.slug}`} className="btn btn-secondary" target="_blank">
              View
            </Link>
            <DeleteButton endpoint={`/api/projects/${id}`} redirectTo="/admin/projects" />
          </div>
        }
      >
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Title">
              <input className="input" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </Field>
            <Field label="Slug">
              <input className="input" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
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
                    value={t.description || ""}
                    onChange={(e) => {
                      const next = [...tech];
                      next[idx] = { ...next[idx], description: e.target.value };
                      setTech(next);
                    }}
                  />
                  <button type="button" className="btn btn-danger" onClick={() => setTech(tech.filter((_, i) => i !== idx))}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <SubmitButton loading={loading} />
            {message && <p className="text-sm text-muted">{message}</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        </form>
      </FormCard>

      {/* Stakeholders */}
      <div className="rounded-2xl border border-border bg-white p-5">
        <h2 className="text-lg font-semibold">Stakeholders</h2>
        <p className="mt-1 text-sm text-muted">Institutions / partners with logos.</p>
        <form onSubmit={addStakeholder} className="mt-4 grid gap-3 md:grid-cols-4">
          <input className="input" placeholder="Name" required value={stakeForm.name} onChange={(e) => setStakeForm({ ...stakeForm, name: e.target.value })} />
          <input className="input" placeholder="Role" value={stakeForm.role} onChange={(e) => setStakeForm({ ...stakeForm, role: e.target.value })} />
          <input className="input" placeholder="Logo URL" value={stakeForm.logoUrl} onChange={(e) => setStakeForm({ ...stakeForm, logoUrl: e.target.value })} />
          <button type="submit" className="btn btn-primary">
            Add
          </button>
        </form>
        <div className="mt-4 space-y-2">
          {stakeholders.map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
              <div>
                <p className="font-medium">{s.name}</p>
                <p className="text-xs text-muted">{s.role || "—"}</p>
              </div>
              <DeleteButton endpoint={`/api/stakeholders/${s.id}`} label="Delete" onDeleted={load} />
            </div>
          ))}
        </div>
      </div>

      {/* Documentation */}
      <div className="rounded-2xl border border-border bg-white p-5">
        <h2 className="text-lg font-semibold">Documentation</h2>
        <form onSubmit={addDoc} className="mt-4 grid gap-3 md:grid-cols-2">
          <input className="input" placeholder="Title" required value={docForm.title} onChange={(e) => setDocForm({ ...docForm, title: e.target.value })} />
          <select className="select" value={docForm.type} onChange={(e) => setDocForm({ ...docForm, type: e.target.value })}>
            <option value="link">Link</option>
            <option value="file">File</option>
            <option value="text">Text</option>
          </select>
          <input className="input" placeholder="URL" value={docForm.url} onChange={(e) => setDocForm({ ...docForm, url: e.target.value })} />
          <input className="input" placeholder="Content / notes" value={docForm.content} onChange={(e) => setDocForm({ ...docForm, content: e.target.value })} />
          <button type="submit" className="btn btn-primary md:col-span-2">
            Add documentation
          </button>
        </form>
        <div className="mt-4 space-y-2">
          {docs.map((d) => (
            <div key={d.id} className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
              <div>
                <p className="font-medium">{d.title}</p>
                <p className="text-xs text-muted">{d.type}</p>
              </div>
              <DeleteButton endpoint={`/api/documentations/${d.id}`} label="Delete" onDeleted={load} />
            </div>
          ))}
        </div>
      </div>

      {/* Visualizations */}
      <div className="rounded-2xl border border-border bg-white p-5">
        <h2 className="text-lg font-semibold">Visualizations</h2>
        <form onSubmit={addViz} className="mt-4 grid gap-3 md:grid-cols-2">
          <input className="input" placeholder="Title" required value={vizForm.title} onChange={(e) => setVizForm({ ...vizForm, title: e.target.value })} />
          <input className="input" placeholder="Image URL" value={vizForm.imageUrl} onChange={(e) => setVizForm({ ...vizForm, imageUrl: e.target.value })} />
          <input className="input" placeholder="Description" value={vizForm.description} onChange={(e) => setVizForm({ ...vizForm, description: e.target.value })} />
          <input className="input" placeholder="Caption" value={vizForm.caption} onChange={(e) => setVizForm({ ...vizForm, caption: e.target.value })} />
          <button type="submit" className="btn btn-primary md:col-span-2">
            Add visualization
          </button>
        </form>
        <div className="mt-4 space-y-2">
          {viz.map((v) => (
            <div key={v.id} className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
              <div>
                <p className="font-medium">{v.title}</p>
                <p className="text-xs text-muted">{v.description || "—"}</p>
              </div>
              <DeleteButton endpoint={`/api/visualizations/${v.id}`} label="Delete" onDeleted={load} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
