"use client";

import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";

export function ExportPDFButton() {
  const [loading, setLoading] = useState(false);

  function handleExport() {
    setLoading(true);
    const win = window.open("/api/export/summary", "_blank");
    // Reset loading after the new window starts loading
    const timer = setTimeout(() => setLoading(false), 1500);
    if (!win) {
      clearTimeout(timer);
      setLoading(false);
      alert("Pop-up blocked. Please allow pop-ups for this site and try again.");
    }
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-muted shadow-sm transition hover:border-neutral-300 hover:text-foreground disabled:opacity-60"
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <FileDown size={14} />
      )}
      Export Executive Summary
    </button>
  );
}
