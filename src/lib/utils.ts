export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseJsonArray<T = string>(value: string | null | undefined, fallback: T[] = []): T[] {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function splitLabels(value?: string | null) {
  return (value || "")
    .split(",")
    .map((label) => label.trim())
    .filter(Boolean);
}

export function formatDateRange(start?: Date | string | null, end?: Date | string | null, isCurrent = false) {
  const fmt = (d: Date | string) => {
    const date = typeof d === "string" ? new Date(d) : d;
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };
  if (!start) return "";
  const startStr = fmt(start);
  if (isCurrent) return `${startStr} — Present`;
  if (!end) return startStr;
  return `${startStr} — ${fmt(end)}`;
}

export function toDateInputValue(date?: Date | string | null) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().slice(0, 10);
}
