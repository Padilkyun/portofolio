"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DeleteButton, Field, FormCard, SubmitButton } from "@/components/admin/FormControls";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { toDateInputValue } from "@/lib/utils";

type ProjectOption = { id: string; title: string };

export default function EditCertificatePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [form, setForm] = useState({
    title: "",
    issuer: "",
    issuedAt: "",
    description: "",
    imageUrl: "",
    credentialUrl: "",
    sortOrder: 0,
    projectId: "",
  });

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data: ProjectOption[]) => setProjects(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setFetching(true);
    fetch(`/api/certificates/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((item: Record<string, unknown>) => {
        setForm({
          title: String(item.title ?? ""),
          issuer: String(item.issuer ?? ""),
          issuedAt: toDateInputValue(item.issuedAt as string | null),
          description: String(item.description ?? ""),
          imageUrl: String(item.imageUrl ?? ""),
          credentialUrl: String(item.credentialUrl ?? ""),
          sortOrder: Number(item.sortOrder ?? 0),
          projectId: String(item.projectId ?? ""),
        });
      })
      .catch(() => setError("Failed to load certificate"))
      .finally(() => setFetching(false));
  }, [id]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/certificates/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          issuedAt: form.issuedAt || null,
          issuer: form.issuer || null,
          description: form.description || null,
          imageUrl: form.imageUrl || null,
          credentialUrl: form.credentialUrl || null,
          projectId: form.projectId || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(typeof data.error === "string" ? data.error : "Update failed");
        return;
      }
      router.push("/admin/certificates");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="rounded-2xl border border-border bg-white p-10 text-center text-sm text-muted">
        Loading…
      </div>
    );
  }

  return (
    <FormCard
      title="Edit certificate"
      description={form.title || undefined}
      actions={
        <div className="flex gap-2">
          <Link href="/admin/certificates" className="btn btn-secondary">
            Back
          </Link>
          <DeleteButton
            endpoint={`/api/certificates/${id}`}
            redirectTo="/admin/certificates"
          />
        </div>
      }
    >
      <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Field label="Certificate title">
            <input
              className="input"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </Field>
        </div>

        <Field label="Issuer / Provider">
          <input
            className="input"
            placeholder="e.g. Google, Dicoding, Coursera"
            value={form.issuer}
            onChange={(e) => setForm({ ...form, issuer: e.target.value })}
          />
        </Field>

        <Field label="Issue date">
          <input
            className="input"
            type="date"
            value={form.issuedAt}
            onChange={(e) => setForm({ ...form, issuedAt: e.target.value })}
          />
        </Field>

        <Field label="Linked project" hint="Optional — associates this achievement with a project">
          <select
            className="select"
            value={form.projectId}
            onChange={(e) => setForm({ ...form, projectId: e.target.value })}
          >
            <option value="">None</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </Field>

        <div className="md:col-span-2">
          <ImageUpload
            label="Certificate image"
            value={form.imageUrl}
            onChange={(url) => setForm({ ...form, imageUrl: url })}
            aspect="cert"
            hint="Upload the certificate image or paste a URL"
          />
        </div>

        <div className="md:col-span-2">
          <Field label="Credential URL" hint="Link to verify the certificate online">
            <input
              className="input"
              placeholder="https://..."
              value={form.credentialUrl}
              onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })}
            />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field label="Description" hint="Brief summary of what this certificate covers">
            <textarea
              className="textarea"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>
        </div>

        <Field label="Sort order" hint="Lower = appears first">
          <input
            className="input"
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
          />
        </Field>

        <div className="md:col-span-2 flex items-center gap-3 pt-2">
          <SubmitButton loading={loading} />
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </form>
    </FormCard>
  );
}
