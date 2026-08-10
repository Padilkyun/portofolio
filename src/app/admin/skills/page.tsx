"use client";

import { FormEvent, useEffect, useState } from "react";
import { DeleteButton, Field, FormCard, SubmitButton } from "@/components/admin/FormControls";

type Skill = {
  id: string;
  name: string;
  category: string;
  level: number;
  sortOrder: number;
};

const LEVELS = [
  { value: 1, label: "Beginner" },
  { value: 2, label: "Elementary" },
  { value: 3, label: "Intermediate" },
  { value: 4, label: "Advanced" },
  { value: 5, label: "Expert" },
] as const;

const empty = { name: "", category: "AI", level: 3, sortOrder: 0 };

export default function AdminSkillsPage() {
  const [items, setItems] = useState<Skill[]>([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function reload() {
    const res = await fetch("/api/skills");
    const data: Skill[] = await res.json();
    setItems(data);
  }

  useEffect(() => {
    fetch("/api/skills")
      .then((r) => r.json())
      .then((data: Skill[]) => setItems(data))
      .catch(() => undefined);
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(editId ? `/api/skills/${editId}` : "/api/skills", {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(typeof data.error === "string" ? data.error : "Save failed");
        return;
      }
      setForm(empty);
      setEditId(null);
      await reload();
    } finally {
      setLoading(false);
    }
  }

  function startEdit(item: Skill) {
    setEditId(item.id);
    setForm({
      name: item.name,
      category: item.category,
      level: item.level,
      sortOrder: item.sortOrder,
    });
  }

  return (
    <div className="space-y-4">
      <FormCard
        title={editId ? "Edit skill" : "Add skill"}
        description="Skills appear grouped by category on the public site."
      >
        <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-4">
          <Field label="Name">
            <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Category">
            <select className="select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {["AI", "IoT", "Embedded", "Cloud", "Data", "Soft"].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Level">
            <select className="select" value={form.level} onChange={(e) => setForm({ ...form, level: Number(e.target.value) })}>
              {LEVELS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Sort">
            <input className="input" type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
          </Field>
          <div className="md:col-span-4 flex items-center gap-3">
            <SubmitButton loading={loading}>{editId ? "Update" : "Add"}</SubmitButton>
            {editId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEditId(null);
                  setForm(empty);
                }}
              >
                Cancel edit
              </button>
            )}
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        </form>
      </FormCard>

      <div className="rounded-2xl border border-border bg-white">
        <div className="border-b border-border p-5">
          <h2 className="font-semibold">All skills ({items.length})</h2>
        </div>
        <div className="divide-y divide-border">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-muted">
                  {item.category} · {LEVELS.find((l) => l.value === item.level)?.label ?? `Level ${item.level}`}
                </p>
              </div>
              <div className="flex gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => startEdit(item)}>
                  Edit
                </button>
                <DeleteButton
                  endpoint={`/api/skills/${item.id}`}
                  label="Delete"
                  onDeleted={reload}
                />
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p className="p-8 text-center text-sm text-muted">No skills yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
