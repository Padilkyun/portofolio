"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Field, FormCard, SubmitButton } from "@/components/admin/FormControls";
import { ImageUpload } from "@/components/admin/ImageUpload";

export default function NewCertificatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    issuer: "",
    issuedAt: "",
    description: "",
    imageUrl: "",
    credentialUrl: "",
    category: "",
    sortOrder: 0,
  });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          issuedAt: form.issuedAt || null,
          issuer: form.issuer || null,
          description: form.description || null,
          imageUrl: form.imageUrl || null,
          credentialUrl: form.credentialUrl || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(typeof data.error === "string" ? data.error : "Save failed");
        return;
      }
      router.push("/admin/certificates");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormCard
      title="New certificate"
      actions={
        <Link href="/admin/certificates" className="btn btn-secondary">
          Back
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Field label="Certificate title">
            <input
              className="input"
              required
              placeholder="e.g. TensorFlow Developer Certificate"
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

        <Field label="Category" hint="e.g. AI, Data Science, IoT, Cloud, Security">
          <input
            className="input"
            placeholder="e.g. AI, Data Science, IoT, Cloud, Security"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
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
              placeholder="e.g. Covers building and deploying ML models using TensorFlow..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>
        </div>

        <Field label="Sort order" hint="Lower = appears first in marquee">
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
