"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DeleteButton, Field, FormCard, SubmitButton } from "@/components/admin/FormControls";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { toDateInputValue } from "@/lib/utils";

export default function EditExperiencePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    company: "",
    role: "",
    location: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
    logoUrl: "",
    sortOrder: 0,
  });

  useEffect(() => {
    setFetching(true);
    fetch(`/api/experiences/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
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
          sortOrder: Number(item.sortOrder ?? 0),
        });
      })
      .catch(() => setError("Failed to load experience"))
      .finally(() => setFetching(false));
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

  if (fetching) {
    return (
      <div className="rounded-2xl border border-border bg-white p-10 text-center text-sm text-muted">
        Loading…
      </div>
    );
  }

  return (
    <FormCard
      title="Edit experience"
      description={form.role ? `${form.role} · ${form.company}` : undefined}
      actions={
        <div className="flex gap-2">
          <Link href={`/work/${id}`} target="_blank" className="btn btn-secondary" title="Preview">
            Preview ↗
          </Link>
          <Link href="/admin/experiences" className="btn btn-secondary">
            Back
          </Link>
          <DeleteButton endpoint={`/api/experiences/${id}`} redirectTo="/admin/experiences" />
        </div>
      }
    >
      <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
        <Field label="Company">
          <input
            className="input"
            required
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />
        </Field>
        <Field label="Role / Position">
          <input
            className="input"
            required
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />
        </Field>
        <Field label="Location">
          <input
            className="input"
            placeholder="e.g. Jakarta, Indonesia"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
        </Field>
        <div className="md:col-span-2">
          <ImageUpload
            label="Company logo"
            value={form.logoUrl}
            onChange={(url) => setForm({ ...form, logoUrl: url })}
            aspect="square"
            hint="Square logo works best"
          />
        </div>
        <Field label="Start date">
          <input
            className="input"
            type="date"
            required
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          />
        </Field>
        <Field label="End date">
          <input
            className="input"
            type="date"
            disabled={form.isCurrent}
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          />
        </Field>
        <div className="flex items-center gap-2 md:col-span-2">
          <input
            id="isCurrent"
            type="checkbox"
            className="h-4 w-4 rounded border-border"
            checked={form.isCurrent}
            onChange={(e) => setForm({ ...form, isCurrent: e.target.checked, endDate: e.target.checked ? "" : form.endDate })}
          />
          <label htmlFor="isCurrent" className="text-sm font-medium">
            Currently working here
          </label>
        </div>
        <div className="md:col-span-2">
          <Field label="Description" hint="Use line breaks for multiple points">
            <textarea
              className="textarea"
              rows={6}
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
