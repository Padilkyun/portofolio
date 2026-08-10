"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Field, FormCard, SubmitButton } from "@/components/admin/FormControls";
import { ImageUpload } from "@/components/admin/ImageUpload";

export default function NewBootcampPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bootcamps", {
        method: "POST",
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
        setError(typeof data.error === "string" ? data.error : "Create failed");
        return;
      }
      router.push("/admin/bootcamps");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormCard
      title="New bootcamp"
      actions={
        <Link href="/admin/bootcamps" className="btn btn-secondary">
          Cancel
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
        <Field label="Name">
          <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Field>
        <Field label="Organizer">
          <input className="input" value={form.organizer} onChange={(e) => setForm({ ...form, organizer: e.target.value })} />
        </Field>
        <Field label="Start date">
          <input className="input" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
        </Field>
        <Field label="End date">
          <input className="input" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
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
        <Field label="Certificate URL">
          <input className="input" value={form.certificateUrl} onChange={(e) => setForm({ ...form, certificateUrl: e.target.value })} />
        </Field>
        <div className="md:col-span-2">
          <Field label="Description">
            <textarea className="textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Skills" hint="Comma-separated, e.g. MQTT, ESP32, TensorFlow Lite">
            <input className="input" value={form.skillsText} onChange={(e) => setForm({ ...form, skillsText: e.target.value })} />
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
