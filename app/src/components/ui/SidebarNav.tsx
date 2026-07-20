"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";

const NAV_ITEMS = [
  { href: "/tableau-de-bord", label: "Tableau de bord", icon: "⊞" },
  { href: "/factures", label: "Factures", icon: "📄" },
  { href: "/devis", label: "Devis", icon: "📋" },
  { href: "/clients", label: "Clients", icon: "👥" },
  { href: "/profil", label: "Mon profil", icon: "⚙" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav style={{ flex: 1, overflowY: "auto" }}>
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === "/tableau-de-bord"
            ? pathname === "/tableau-de-bord"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebar-nav-item${isActive ? " active" : ""}`}
          >
            <span style={{ fontSize: "16px", width: "20px", textAlign: "center" }}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}

      <div
        style={{
          margin: "12px",
          borderTop: "1px solid rgba(255,255,255,.1)",
          paddingTop: "12px",
        }}
      >
        <form action={logout}>
          <button
            type="submit"
            className="sidebar-nav-item"
            style={{ width: "100%", border: "none", background: "none", textAlign: "left" }}
          >
            <span style={{ fontSize: "16px", width: "20px", textAlign: "center" }}>↩</span>
            Déconnexion
          </button>
        </form>
      </div>
    </nav>
  );
}
