"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DeleteButton, Field, FormCard, SubmitButton } from "@/components/admin/FormControls";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { toDateInputValue } from "@/lib/utils";
import { FileText, Link2, AlignLeft, Trash2 } from "lucide-react";

type Doc = {
  id: string;
  title: string;
  type: string;
  url?: string | null;
  content?: string | null;
  sortOrder: number;
};

const DOC_TYPE_ICON: Record<string, React.ReactNode> = {
  link: <Link2 size={13} />,
  file: <FileText size={13} />,
  text: <AlignLeft size={13} />,
};

export default function EditExperiencePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [docs, setDocs] = useState<Doc[]>([]);
  const [docForm, setDocForm] = useState({ title: "", type: "link", url: "", content: "" });
  const [docLoading, setDocLoading] = useState(false);
  const [form, setForm] = useState({
    company: "",
    role: "",
    location: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
    logoUrl: "",
    photoUrl: "",
    skillsText: "",
    sortOrder: 0,
  });

  async function loadDocs() {
    const res = await fetch(`/api/experiences/${id}/documentations`);
    if (res.ok) setDocs(await res.json());
  }

  useEffect(() => {
    setFetching(true);
    fetch(`/api/experiences/${id}`)
      .then((r) => { if (!r.ok) throw new Error("Not found"); return r.json(); })
      .then((item: Record<string, unknown>) => {
        setForm({
          company: String(item.company ?? ""),
          role: String(item.role ?? ""),
          location: String(item.location ?? ""),
          startDate: toDateInputValue(item.startDate as string),
          endDate: toDateInputValue(item.endDate as string | null),
          isCurrent: Boolean(item.isCurrent),
          description: String(item.description ?? ""),
          logoUrl: String(item.logoUrl ?? ""),
          photoUrl: String(item.photoUrl ?? ""),
          skillsText: (() => {
            try { return (JSON.parse(String(item.skills ?? "[]")) as string[]).join(", "); }
            catch { return ""; }
          })(),
          sortOrder: Number(item.sortOrder ?? 0),
        });
      })
      .catch(() => setError("Failed to load experience"))
      .finally(() => setFetching(false));

    loadDocs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/experiences/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          photoUrl: form.photoUrl || null,
          skills: form.skillsText.split(",").map((s) => s.trim()).filter(Boolean),
          endDate: form.isCurrent ? null : form.endDate || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(typeof data.error === "string" ? data.error : "Update failed");
        return;
      }
      router.push("/admin/experiences");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function addDoc(e: FormEvent) {
    e.preventDefault();
    setDocLoading(true);
    try {
      const res = await fetch(`/api/experiences/${id}/documentations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: docForm.title,
          type: docForm.type,
          url: docForm.url || null,
          content: docForm.content || null,
        }),
      });
      if (res.ok) {
        setDocForm({ title: "", type: "link", url: "", content: "" });
        await loadDocs();
      }
    } finally {
      setDocLoading(false);
    }
  }

  async function deleteDoc(docId: string) {
    if (!confirm("Delete this documentation?")) return;
    await fetch(`/api/experience-docs/${docId}`, { method: "DELETE" });
    await loadDocs();
  }

  if (fetching) {
    return (
      <div className="rounded-2xl border border-border bg-white p-10 text-center text-sm text-muted">
        Loading…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Main form ── */}
      <FormCard
        title="Edit experience"
        description={form.role ? `${form.role} · ${form.company}` : undefined}
        actions={
          <div className="flex gap-2">
            <Link href={`/work/${id}`} target="_blank" className="btn btn-secondary">Preview ↗</Link>
            <Link href="/admin/experiences" className="btn btn-secondary">Back</Link>
            <DeleteButton endpoint={`/api/experiences/${id}`} redirectTo="/admin/experiences" />
          </div>
        }
      >
        <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
          <Field label="Company">
            <input className="input" required value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })} />
          </Field>
          <Field label="Role / Position">
            <input className="input" required value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })} />
          </Field>
          <Field label="Location">
            <input className="input" placeholder="e.g. Jakarta, Indonesia" value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </Field>
          <div className="md:col-span-2">
            <ImageUpload label="Company logo" value={form.logoUrl}
              onChange={(url) => setForm({ ...form, logoUrl: url })}
              aspect="square" hint="Square logo works best" />
          </div>
          <div className="md:col-span-2">
            <ImageUpload label="Cover / team photo" value={form.photoUrl}
              onChange={(url) => setForm({ ...form, photoUrl: url })}
              aspect="landscape" hint="Workplace or team photo shown on the detail page" />
          </div>
          <Field label="Start date">
            <input className="input" type="date" required value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          </Field>
          <Field label="End date">
            <input className="input" type="date" disabled={form.isCurrent} value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          </Field>
          <div className="flex items-center gap-2 md:col-span-2">
            <input id="isCurrent" type="checkbox" className="h-4 w-4 rounded border-border"
              checked={form.isCurrent}
              onChange={(e) => setForm({ ...form, isCurrent: e.target.checked, endDate: e.target.checked ? "" : form.endDate })} />
            <label htmlFor="isCurrent" className="text-sm font-medium">Currently working here</label>
          </div>
          <div className="md:col-span-2">
            <Field label="Description" hint="Use line breaks for multiple points">
              <textarea className="textarea" rows={6} value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Field>
          </div>
          <Field label="Sort order" hint="Lower = appears first">
            <input className="input" type="number" value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
          </Field>
          <div className="md:col-span-2">
            <Field label="Skills" hint="Comma-separated — e.g. Python, MQTT, ESP32, TensorFlow Lite">
              <input className="input" placeholder="Skill 1, Skill 2, Skill 3"
                value={form.skillsText}
                onChange={(e) => setForm({ ...form, skillsText: e.target.value })} />
            </Field>
            {form.skillsText && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {form.skillsText.split(",").map((s) => s.trim()).filter(Boolean).map((s) => (
                  <span key={s} className="badge text-[11px]">{s}</span>
                ))}
              </div>
            )}
          </div>
          <div className="md:col-span-2 flex items-center gap-3 pt-2">
            <SubmitButton loading={loading} />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        </form>
      </FormCard>

      {/* ── Documentation ── */}
      <div className="rounded-2xl border border-border bg-white p-5">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Documentation</h2>
          <p className="mt-0.5 text-sm text-muted">
            Attach links, files, or notes related to this role — reports, presentations, GitHub repos, etc.
          </p>
        </div>

        {/* Add form */}
        <form onSubmit={addDoc} className="grid gap-3 rounded-xl border border-border bg-surface p-4 md:grid-cols-2">
          <Field label="Title">
            <input className="input" required placeholder="e.g. Project Report, GitHub Repo"
              value={docForm.title}
              onChange={(e) => setDocForm({ ...docForm, title: e.target.value })} />
          </Field>
          <Field label="Type">
            <select className="select" value={docForm.type}
              onChange={(e) => setDocForm({ ...docForm, type: e.target.value })}>
              <option value="link">Link / URL</option>
              <option value="file">File</option>
              <option value="text">Text / Note</option>
            </select>
          </Field>
          {docForm.type !== "text" && (
            <div className="md:col-span-2">
              <Field label="URL" hint="Direct link to the resource">
                <input className="input" placeholder="https://..."
                  value={docForm.url}
                  onChange={(e) => setDocForm({ ...docForm, url: e.target.value })} />
              </Field>
            </div>
          )}
          {docForm.type === "text" && (
            <div className="md:col-span-2">
              <Field label="Content">
                <textarea className="textarea" rows={3} placeholder="Notes or description..."
                  value={docForm.content}
                  onChange={(e) => setDocForm({ ...docForm, content: e.target.value })} />
              </Field>
            </div>
          )}
          <div className="md:col-span-2">
            <button type="submit" disabled={docLoading} className="btn btn-primary">
              {docLoading ? "Adding…" : "+ Add documentation"}
            </button>
          </div>
        </form>

        {/* List */}
        <div className="mt-4 space-y-2">
          {docs.length === 0 && (
            <p className="text-sm text-muted">No documentation added yet.</p>
          )}
          {docs.map((d) => (
            <div key={d.id} className="flex items-center justify-between rounded-xl border border-border bg-white px-4 py-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="shrink-0 text-muted">{DOC_TYPE_ICON[d.type] ?? <Link2 size={13} />}</span>
                <div className="min-w-0">
                  <p className="truncate font-medium text-sm">{d.title}</p>
                  {d.url && (
                    <a href={d.url} target="_blank" rel="noreferrer"
                      className="truncate text-xs text-muted hover:text-foreground">
                      {d.url}
                    </a>
                  )}
                  {d.content && (
                    <p className="line-clamp-1 text-xs text-muted">{d.content}</p>
                  )}
                </div>
              </div>
              <button type="button" onClick={() => deleteDoc(d.id)}
                className="ml-3 shrink-0 rounded-lg p-1.5 text-muted hover:bg-red-50 hover:text-red-600 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
