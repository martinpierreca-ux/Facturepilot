"use client";

import { useActionState } from "react";
import Link from "next/link";
import { forgotPassword, type AuthState } from "@/app/actions/auth";
import { Logo } from "@/components/ui/Logo";
import { SubmitButton } from "@/components/ui/SubmitButton";

const initialState: AuthState = {};

export default function MotDePasseOubliePage() {
  const [state, formAction] = useActionState(forgotPassword, initialState);

  return (
    <div className="auth-card">
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <Logo size="lg" />
        <h1
          style={{
            fontFamily: "var(--display)",
            fontSize: "22px",
            fontWeight: 700,
            marginTop: "20px",
            color: "var(--ink)",
          }}
        >
          Réinitialiser le mot de passe
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "14px", marginTop: "6px" }}>
          Entrez votre email pour recevoir un lien de réinitialisation.
        </p>
      </div>

      {state.error && (
        <div className="alert alert-error" style={{ marginBottom: "20px" }}>
          <span>⚠</span>
          <span>{state.error}</span>
        </div>
      )}

      {state.success && (
        <div className="alert alert-success" style={{ marginBottom: "20px" }}>
          <span>✓</span>
          <span>{state.success}</span>
        </div>
      )}

      <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div className="field">
          <label htmlFor="email">Adresse email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="vous@exemple.fr"
            required
            autoComplete="email"
          />
        </div>

        <SubmitButton label="Envoyer le lien" loadingLabel="Envoi…" />
      </form>

      <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px" }}>
        <Link href="/connexion" style={{ color: "var(--green)", fontWeight: 600 }}>
          ← Retour à la connexion
        </Link>
      </p>
    </div>
  );
}
