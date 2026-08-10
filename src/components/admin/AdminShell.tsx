"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Award,
  Briefcase,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Sparkles,
  UserRound,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profile", icon: UserRound },
  { href: "/admin/experiences", label: "Experience", icon: Briefcase },
  { href: "/admin/bootcamps", label: "Bootcamp", icon: GraduationCap },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/skills", label: "Skills", icon: Sparkles },
  { href: "/admin/certificates", label: "Certificates", icon: Award },
];

export function AdminShell({
  children,
  email,
}: {
  children: React.ReactNode;
  email?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="border-b border-border bg-white">
        <div className="container-page flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <Wrench size={16} />
            <span className="text-sm font-semibold">Portfolio Admin</span>
          </div>
          <div className="flex items-center gap-3">
            {email && <span className="hidden text-xs text-muted sm:inline">{email}</span>}
            <Link href="/" className="btn btn-secondary !py-1.5 !text-xs">
              View site
            </Link>
            <button type="button" onClick={logout} className="btn btn-secondary !py-1.5 !text-xs">
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container-page grid gap-6 py-6 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-2xl border border-border bg-white p-2">
          <nav className="space-y-1">
            {nav.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
                    active
                      ? "bg-neutral-900 text-white"
                      : "text-muted hover:bg-surface hover:text-foreground"
                  )}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
