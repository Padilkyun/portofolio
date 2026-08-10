"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
  aspect?: "square" | "landscape" | "cert";
}

export function ImageUpload({
  value,
  onChange,
  label = "Image",
  hint,
  aspect = "landscape",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  const aspectClass = {
    square: "aspect-square",
    landscape: "aspect-[4/3]",
    cert: "aspect-[4/3]",
  }[aspect];

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
    // reset so same file can be re-selected
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
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
            <X size={14} />
          </button>
        )}
      </div>

      {/* Preview or drop zone */}
      {value ? (
        <div className={`relative w-full overflow-hidden rounded-xl border border-border bg-neutral-50 ${aspectClass}`}>
          <Image
            src={value}
            alt={label}
            fill
            className="object-contain p-2"
            unoptimized
          />
          {/* Replace overlay */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-neutral-900/0 opacity-0 transition-all hover:bg-neutral-900/50 hover:opacity-100 text-white text-xs font-medium"
          >
            <Upload size={18} />
            Replace
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors ${aspectClass} ${
            dragging
              ? "border-neutral-400 bg-neutral-50"
              : "border-border bg-surface hover:border-neutral-300 hover:bg-neutral-50"
          }`}
        >
          {uploading ? (
            <>
              <Loader2 size={22} className="animate-spin text-muted" />
              <p className="text-xs text-muted">Uploading…</p>
            </>
          ) : (
            <>
              <ImageIcon size={22} className="text-neutral-300" />
              <p className="text-xs text-muted text-center px-4">
                <span className="font-medium text-foreground">Click to upload</span>
                {" or drag & drop"}
              </p>
              <p className="text-[11px] text-neutral-400">JPG, PNG, WebP · max 5MB</p>
            </>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileInput}
      />

      {/* URL input as fallback */}
      <div className="mt-2">
        <input
          type="text"
          className="input text-xs"
          placeholder="…or paste an image URL"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
