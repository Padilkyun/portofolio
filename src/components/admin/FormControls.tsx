"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function FormCard({
  title,
  description,
  children,
  actions,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white">
      <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted">{description}</p>}
        </div>
        {actions}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export function DeleteButton({
  endpoint,
  redirectTo,
  label = "Delete",
  onDeleted,
}: {
  endpoint: string;
  redirectTo?: string;
  label?: string;
  onDeleted?: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onDelete() {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    setLoading(true);
    try {
      const res = await fetch(endpoint, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Delete failed");
        return;
      }
      onDeleted?.();
      if (redirectTo) router.push(redirectTo);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button type="button" onClick={onDelete} disabled={loading} className="btn btn-danger">
      {loading ? "Deleting..." : label}
    </button>
  );
}

export function SubmitButton({
  loading,
  children = "Save",
}: {
  loading?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <button type="submit" disabled={loading} className="btn btn-primary">
      {loading ? "Saving..." : children}
    </button>
  );
}
