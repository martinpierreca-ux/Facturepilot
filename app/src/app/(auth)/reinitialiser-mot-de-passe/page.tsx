"use client";

import { useActionState } from "react";
import { resetPassword, type AuthState } from "@/app/actions/auth";
import { Logo } from "@/components/ui/Logo";
import { SubmitButton } from "@/components/ui/SubmitButton";

const initialState: AuthState = {};

export default function ReinitialiserMotDePassePage() {
  const [state, formAction] = useActionState(resetPassword, initialState);

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
          Nouveau mot de passe
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "14px", marginTop: "6px" }}>
          Choisissez un mot de passe sécurisé.
        </p>
      </div>

      {state.error && (
        <div className="alert alert-error" style={{ marginBottom: "20px" }}>
          <span>⚠</span>
          <span>{state.error}</span>
        </div>
      )}

      <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div className="field">
          <label htmlFor="password">Nouveau mot de passe</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="8 caractères minimum"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>

        <div className="field">
          <label htmlFor="confirm">Confirmer le mot de passe</label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            placeholder="••••••••"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>

        <SubmitButton label="Mettre à jour" loadingLabel="Mise à jour…" />
      </form>
    </div>
  );
}
