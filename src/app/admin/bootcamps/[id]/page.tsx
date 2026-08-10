"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DeleteButton, Field, FormCard, SubmitButton } from "@/components/admin/FormControls";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { parseJsonArray, toDateInputValue } from "@/lib/utils";

export default function EditBootcampPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    organizer: "",
    startDate: "",
    endDate: "",
    description: "",
    certificateUrl: "",
    logoUrl: "",
    skillsText: "",
    sortOrder: 0,
  });

  useEffect(() => {
    setFetching(true);
    fetch(`/api/bootcamps/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((item: Record<string, unknown>) => {
        setForm({
          name: String(item.name ?? ""),
          organizer: String(item.organizer ?? ""),
          startDate: toDateInputValue(item.startDate as string | null),
          endDate: toDateInputValue(item.endDate as string | null),
          description: String(item.description ?? ""),
          certificateUrl: String(item.certificateUrl ?? ""),
          logoUrl: String(item.logoUrl ?? ""),
          skillsText: parseJsonArray<string>(String(item.skills ?? "[]")).join(", "),
          sortOrder: Number(item.sortOrder ?? 0),
        });
      })
      .catch(() => setError("Failed to load bootcamp"))
      .finally(() => setFetching(false));
  }, [id]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/bootcamps/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          organizer: form.organizer || null,
          startDate: form.startDate || null,
          endDate: form.endDate || null,
          description: form.description || null,
          certificateUrl: form.certificateUrl || null,
          logoUrl: form.logoUrl || null,
          skills: form.skillsText
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          sortOrder: form.sortOrder,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(typeof data.error === "string" ? data.error : "Update failed");
        return;
      }
      router.push("/admin/bootcamps");
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
      title="Edit bootcamp"
      description={form.name || undefined}
      actions={
        <div className="flex gap-2">
          <Link href={`/bootcamp/${id}`} target="_blank" className="btn btn-secondary" title="Preview">
            Preview ↗
          </Link>
          <Link href="/admin/bootcamps" className="btn btn-secondary">
            Back
          </Link>
          <DeleteButton endpoint={`/api/bootcamps/${id}`} redirectTo="/admin/bootcamps" />
        </div>
      }
    >
      <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
        <Field label="Program name">
          <input
            className="input"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Field>
        <Field label="Organizer / Provider">
          <input
            className="input"
            placeholder="e.g. Dicoding, Bangkit, MSIB"
            value={form.organizer}
            onChange={(e) => setForm({ ...form, organizer: e.target.value })}
          />
        </Field>
        <Field label="Start date">
          <input
            className="input"
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          />
        </Field>
        <Field label="End date">
          <input
            className="input"
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          />
        </Field>
        <div className="md:col-span-2">
          <ImageUpload
            label="Program logo"
            value={form.logoUrl}
            onChange={(url) => setForm({ ...form, logoUrl: url })}
            aspect="square"
            hint="Square logo works best"
          />
        </div>
        <Field label="Certificate URL" hint="Link to certificate PDF or credential page">
          <input
            className="input"
            placeholder="https://..."
            value={form.certificateUrl}
            onChange={(e) => setForm({ ...form, certificateUrl: e.target.value })}
          />
        </Field>
        <div className="md:col-span-2">
          <Field label="Description" hint="Program overview, what was learned, key achievements">
            <textarea
              className="textarea"
              rows={5}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field
            label="Skills covered"
            hint="Comma-separated — e.g. MQTT, ESP32, TensorFlow Lite, Python"
          >
            <input
              className="input"
              placeholder="Skill 1, Skill 2, Skill 3"
              value={form.skillsText}
              onChange={(e) => setForm({ ...form, skillsText: e.target.value })}
            />
          </Field>
          {form.skillsText && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {form.skillsText.split(",").map((s) => s.trim()).filter(Boolean).map((s) => (
                <span key={s} className="badge text-[11px]">{s}</span>
              ))}
            </div>
          )}
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
