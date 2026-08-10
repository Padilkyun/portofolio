"use client";

import { FormEvent, useEffect, useState } from "react";
import { Field, FormCard, SubmitButton } from "@/components/admin/FormControls";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { FileUpload } from "@/components/admin/FileUpload";

type ProfileForm = {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  photoUrl: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
  resumeUrl: string;
};

const empty: ProfileForm = {
  name: "",
  title: "",
  tagline: "",
  bio: "",
  photoUrl: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  website: "",
  resumeUrl: "",
};

export default function AdminProfilePage() {
  const [form, setForm] = useState<ProfileForm>(empty);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (!data) return;
        setForm({
          name: data.name || "",
          title: data.title || "",
          tagline: data.tagline || "",
          bio: data.bio || "",
          photoUrl: data.photoUrl || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          linkedin: data.linkedin || "",
          github: data.github || "",
          website: data.website || "",
          resumeUrl: data.resumeUrl || "",
        });
      })
      .catch(() => undefined);
  }, []);

  function set<K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMessage(data.error || "Save failed");
        return;
      }
      setMessage("Profile saved.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormCard title="Profile" description="Hero identity shown on the main page.">
      <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
        <Field label="Full name">
          <input className="input" value={form.name} onChange={(e) => set("name", e.target.value)} required />
        </Field>
        <Field label="Title / role">
          <input className="input" value={form.title} onChange={(e) => set("title", e.target.value)} required />
        </Field>
        <Field label="Tagline">
          <input className="input" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
        </Field>
        <div className="md:col-span-2">
          <ImageUpload
            label="Profile photo"
            value={form.photoUrl}
            onChange={(url) => set("photoUrl", url)}
            aspect="square"
            hint="Your profile photo shown on the hero card"
          />
        </div>
        <div className="md:col-span-2">
          <Field label="Bio">
            <textarea className="textarea" value={form.bio} onChange={(e) => set("bio", e.target.value)} />
          </Field>
        </div>
        <Field label="Email">
          <input className="input" value={form.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field label="Phone">
          <input className="input" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </Field>
        <Field label="Location">
          <input className="input" value={form.location} onChange={(e) => set("location", e.target.value)} />
        </Field>
        <Field label="Website">
          <input className="input" value={form.website} onChange={(e) => set("website", e.target.value)} />
        </Field>
        <Field label="LinkedIn">
          <input className="input" value={form.linkedin} onChange={(e) => set("linkedin", e.target.value)} />
        </Field>
        <Field label="GitHub">
          <input className="input" value={form.github} onChange={(e) => set("github", e.target.value)} />
        </Field>
        <div className="md:col-span-2">
          <FileUpload
            label="Resume / CV Document"
            value={form.resumeUrl}
            onChange={(url) => set("resumeUrl", url)}
            hint="Upload your CV (PDF or Word) or provide a link"
          />
        </div>
        <div className="md:col-span-2 flex items-center gap-3">
          <SubmitButton loading={loading} />
          {message && <p className="text-sm text-muted">{message}</p>}
        </div>
      </form>
    </FormCard>
  );
}
