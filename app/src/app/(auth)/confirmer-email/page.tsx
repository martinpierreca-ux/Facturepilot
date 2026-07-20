import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default function ConfirmerEmailPage() {
  return (
    <div className="auth-card" style={{ textAlign: "center" }}>
      <Logo size="lg" />
      <div style={{ fontSize: "48px", margin: "24px 0 16px" }}>✅</div>
      <h1
        style={{
          fontFamily: "var(--display)",
          fontSize: "22px",
          fontWeight: 700,
          color: "var(--ink)",
          marginBottom: "12px",
        }}
      >
        Email confirmé !
      </h1>
      <p style={{ color: "var(--muted)", fontSize: "15px", lineHeight: "1.6", marginBottom: "28px" }}>
        Votre adresse email a été confirmée. Vous pouvez maintenant vous
        connecter à votre compte FacturePilot.
      </p>
      <Link
        href="/connexion"
        className="btn btn-primary"
        style={{ display: "inline-flex", width: "auto", padding: "12px 32px" }}
      >
        Se connecter
      </Link>
    </div>
  );
}
