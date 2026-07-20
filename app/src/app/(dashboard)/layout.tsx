import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/ui/Logo";
import { SidebarNav } from "@/components/ui/SidebarNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div style={{ padding: "0 20px 20px" }}>
          <Logo size="sm" />
        </div>
        <SidebarNav />
      </aside>

      {/* Main content */}
      <main className="dashboard-main" style={{ flex: 1 }}>
        {children}
      </main>
    </div>
  );
}
