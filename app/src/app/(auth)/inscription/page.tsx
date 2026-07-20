"use client";

import { useActionState } from "react";
import Link from "next/link";
import { register, type AuthState } from "@/app/actions/auth";
import { Logo } from "@/components/ui/Logo";
import { SubmitButton } from "@/components/ui/SubmitButton";

const initialState: AuthState = {};

export default function InscriptionPage() {
  const [state, formAction] = useActionState(register, initialState);

  if (state.success) {
    return (
      <div className="auth-card" style={{ textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>📧</div>
        <h2
          style={{
            fontFamily: "var(--display)",
            fontSize: "20px",
            fontWeight: 700,
            color: "var(--ink)",
            marginBottom: "12px",
          }}
        >
          Vérifiez votre email
        </h2>
        <p style={{ color: "var(--muted)", fontSize: "15px", lineHeight: "1.6" }}>
          {state.success}
        </p>
        <p style={{ marginTop: "24px", fontSize: "14px", color: "var(--muted)" }}>
          <Link href="/connexion" style={{ color: "var(--green)", fontWeight: 600 }}>
            Retour à la connexion
          </Link>
        </p>
      </div>
    );
  }

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
          Créer votre compte gratuit
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "14px", marginTop: "6px" }}>
          Déjà un compte ?{" "}
          <Link
            href="/connexion"
            style={{ color: "var(--green)", fontWeight: 600 }}
          >
            Se connecter
          </Link>
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
          <label htmlFor="full_name">Nom complet</label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            placeholder="Marie Dupont"
            required
            autoComplete="name"
          />
        </div>

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

        <div className="field">
          <label htmlFor="password">Mot de passe</label>
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

        <SubmitButton label="Créer mon compte" loadingLabel="Création du compte…" />

        <p
          style={{
            fontSize: "12px",
            color: "var(--muted)",
            textAlign: "center",
            lineHeight: "1.5",
          }}
        >
          En créant un compte, vous acceptez nos{" "}
          <Link href="https://facturepilot.fr/cgv" style={{ color: "var(--green)" }}>
            CGV
          </Link>{" "}
          et notre{" "}
          <Link href="https://facturepilot.fr/confidentialite" style={{ color: "var(--green)" }}>
            politique de confidentialité
          </Link>
          .
        </p>
      </form>
    </div>
  );
}
