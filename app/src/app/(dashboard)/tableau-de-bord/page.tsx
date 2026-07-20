import { createClient } from "@/lib/supabase/server";

export default async function TableauDeBordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const firstName =
    user?.user_metadata?.full_name?.split(" ")[0] ??
    user?.email?.split("@")[0] ??
    "vous";

  return (
    <div className="page-content">
      <h1
        style={{
          fontFamily: "var(--display)",
          fontSize: "28px",
          fontWeight: 700,
          color: "var(--ink)",
          marginBottom: "8px",
        }}
      >
        Bonjour, {firstName} 👋
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "40px" }}>
        Votre espace FacturePilot est prêt.
      </p>

      {/* KPI cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        {[
          { label: "Factures ce mois", value: "0", color: "var(--green)" },
          { label: "Devis en attente", value: "0", color: "var(--amber)" },
          { label: "Clients", value: "0", color: "var(--indigo)" },
          { label: "CA ce mois", value: "0 €", color: "var(--teal)" },
        ].map((kpi) => (
          <div
            key={kpi.label}
            style={{
              background: "#fff",
              border: "1px solid var(--line)",
              borderRadius: "var(--r2)",
              padding: "24px",
              boxShadow: "var(--sh)",
            }}
          >
            <div
              style={{
                fontSize: "28px",
                fontWeight: 800,
                fontFamily: "var(--display)",
                color: kpi.color,
              }}
            >
              {kpi.value}
            </div>
            <div style={{ color: "var(--muted)", fontSize: "14px", marginTop: "4px" }}>
              {kpi.label}
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div
        style={{
          background: "var(--green-bg)",
          border: "1px solid var(--green-l)",
          borderRadius: "var(--r2)",
          padding: "28px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "var(--display)",
              fontSize: "18px",
              fontWeight: 700,
              color: "var(--green-d)",
              marginBottom: "4px",
            }}
          >
            Commencez à facturer
          </h2>
          <p style={{ color: "var(--green-d)", fontSize: "14px", opacity: 0.8 }}>
            Créez votre première facture en 2 minutes.
          </p>
        </div>
        <a
          href="/factures/nouvelle"
          className="btn btn-primary"
          style={{ width: "auto" }}
        >
          + Nouvelle facture
        </a>
      </div>
    </div>
  );
}
