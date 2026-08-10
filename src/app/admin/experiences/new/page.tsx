"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Field, FormCard, SubmitButton } from "@/components/admin/FormControls";
import { ImageUpload } from "@/components/admin/ImageUpload";

export default function NewExperiencePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/experiences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          endDate: form.isCurrent ? null : form.endDate || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(typeof data.error === "string" ? data.error : "Create failed");
        return;
      }
      router.push("/admin/experiences");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormCard
      title="New experience"
      actions={
        <Link href="/admin/experiences" className="btn btn-secondary">
          Cancel
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
        <Field label="Company">
          <input className="input" required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
        </Field>
        <Field label="Role">
          <input className="input" required value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
        </Field>
        <Field label="Location">
          <input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
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
          <input className="input" type="date" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
        </Field>
        <Field label="End date">
          <input className="input" type="date" disabled={form.isCurrent} value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
        </Field>
        <div className="flex items-center gap-2 md:col-span-2">
          <input
            id="isCurrent"
            type="checkbox"
            checked={form.isCurrent}
            onChange={(e) => setForm({ ...form, isCurrent: e.target.checked })}
          />
          <label htmlFor="isCurrent" className="text-sm">
            Currently working here
          </label>
        </div>
        <div className="md:col-span-2">
          <Field label="Description">
            <textarea className="textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
        </div>
        <Field label="Sort order">
          <input className="input" type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
        </Field>
        <div className="md:col-span-2 flex items-center gap-3">
          <SubmitButton loading={loading}>Create</SubmitButton>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </form>
    </FormCard>
  );
}
