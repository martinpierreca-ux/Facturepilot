"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, type AuthState } from "@/app/actions/auth";
import { Logo } from "@/components/ui/Logo";
import { SubmitButton } from "@/components/ui/SubmitButton";

const initialState: AuthState = {};

export default function ConnexionPage() {
  const [state, formAction] = useActionState(login, initialState);

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
          Connexion à votre compte
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "14px", marginTop: "6px" }}>
          Pas encore de compte ?{" "}
          <Link
            href="/inscription"
            style={{ color: "var(--green)", fontWeight: 600 }}
          >
            Créer un compte gratuit
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
          <label htmlFor="password">
            Mot de passe{" "}
            <Link
              href="/mot-de-passe-oublie"
              style={{
                color: "var(--green)",
                fontWeight: 500,
                fontSize: "13px",
                float: "right",
              }}
            >
              Mot de passe oublié ?
            </Link>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
        </div>

        <SubmitButton label="Se connecter" loadingLabel="Connexion…" />
      </form>
    </div>
  );
}
