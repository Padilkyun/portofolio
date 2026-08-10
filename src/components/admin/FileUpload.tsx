"use client";

import { useRef, useState } from "react";
import { Upload, X, FileText, Loader2 } from "lucide-react";

interface FileUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
}

export function FileUpload({
  value,
  onChange,
  label = "Resume / CV",
  hint,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function uploadFile(file: File) {
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Upload failed");
        return;
      }
      onChange(data.url);
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  }

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="label mb-0">{label}</label>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs text-muted hover:text-red-500 transition-colors"
          >
            <X size={14} /> Remove
          </button>
        )}
      </div>

      {value ? (
        <div className="flex items-center justify-between rounded-xl border border-border bg-neutral-50 p-4">
          <div className="flex items-center gap-3 truncate">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-white">
              <FileText size={20} />
            </div>
            <div className="truncate">
              <p className="text-sm font-medium truncate">Uploaded Resume / Document</p>
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-muted hover:underline truncate block"
              >
                {value}
              </a>
            </div>
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="btn btn-secondary shrink-0 text-xs py-1.5 px-3"
          >
            Replace
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-surface p-6 hover:border-neutral-300 hover:bg-neutral-50 transition-colors"
        >
          {uploading ? (
            <>
              <Loader2 size={22} className="animate-spin text-muted" />
              <p className="text-xs text-muted">Uploading document…</p>
            </>
          ) : (
            <>
              <FileText size={24} className="text-neutral-300" />
              <p className="text-xs text-muted text-center">
                <span className="font-medium text-foreground">Click to upload CV</span>
                {" or drag & drop (PDF, DOC, DOCX)"}
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={handleFileInput}
      />

      <div className="mt-2">
        <input
          type="text"
          className="input text-xs"
          placeholder="…or paste file URL directly"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
