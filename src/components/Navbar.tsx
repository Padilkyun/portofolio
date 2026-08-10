"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, FileDown } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const links = [
  { href: "/#about", label: "About" },
  { href: "/#experience", label: "Experience" },
  { href: "/#bootcamp", label: "Bootcamp" },
  { href: "/#portfolio", label: "Portfolio" },
  { href: "/#skills", label: "Skills" },
  { href: "/#certificates", label: "Certificates" },
  { href: "/contact", label: "Contact" },
];

export function Navbar({ name, resumeUrl }: { name?: string; resumeUrl?: string | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const isAdmin = pathname.startsWith("/admin");
  if (isAdmin) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-white/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          {name || "AIoT Engineer"}
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onMouseEnter={() => setHovered(l.href)}
              onMouseLeave={() => setHovered(null)}
              className="relative rounded-full px-3 py-1.5 text-sm text-muted transition hover:text-foreground"
            >
              {hovered === l.href && (
                <motion.span
                  layoutId="nav-bubble"
                  className="absolute inset-0 -z-10 rounded-full bg-surface"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              {l.label}
            </Link>
          ))}

          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="relative ml-1 inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-neutral-700 hover:shadow-md active:scale-95"
            >
              {/* Ping dot */}
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
              <FileDown size={13} />
              Download CV
            </a>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-neutral-900 bg-neutral-900 px-3 py-1 text-xs font-medium text-white md:hidden"
            >
              <FileDown size={12} />
              CV
            </a>
          )}
          <button
            type="button"
            className="rounded-lg border border-border p-2 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-white md:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="mt-1 flex items-center gap-2 rounded-lg bg-neutral-900 px-3 py-2.5 text-sm font-semibold text-white"
              >
                <FileDown size={14} />
                Download CV
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer({ name, email }: { name?: string; email?: string | null }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="mt-auto border-t border-border bg-white">
      <div className="container-page flex flex-col gap-3 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} {name || "AIoT Engineer"}. Built with care.
        </p>
        <div className="flex items-center gap-4 text-sm text-muted">
          {email && (
            <a href={`mailto:${email}`} className="hover:text-foreground">
              {email}
            </a>
          )}
          <Link href="/admin/login" className={cn("hover:text-foreground")}>
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
