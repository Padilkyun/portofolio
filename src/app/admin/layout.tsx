import { getSession } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Login page renders bare; authenticated pages get shell
  if (!session) {
    return <>{children}</>;
  }

  return <AdminShell email={session.email}>{children}</AdminShell>;
}
