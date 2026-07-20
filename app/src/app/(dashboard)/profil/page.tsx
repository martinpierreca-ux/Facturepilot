"use client";

import { useActionState, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateProfile, type AuthState } from "@/app/actions/auth";
import { SubmitButton } from "@/components/ui/SubmitButton";
import type { User } from "@supabase/supabase-js";

const initialState: AuthState = {};

export default function ProfilPage() {
  const [state, formAction] = useActionState(updateProfile, initialState);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  return (
    <div className="page-content">
      <h1
        style={{
          fontFamily: "var(--display)",
          fontSize: "24px",
          fontWeight: 700,
          color: "var(--ink)",
          marginBottom: "32px",
        }}
      >
        Mon profil
      </h1>

      <div className="profile-card" style={{ maxWidth: "560px" }}>
        <h2
          style={{
            fontFamily: "var(--display)",
            fontSize: "16px",
            fontWeight: 700,
            color: "var(--ink)",
            marginBottom: "24px",
            paddingBottom: "16px",
            borderBottom: "1px solid var(--line)",
          }}
        >
          Informations personnelles
        </h2>

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

        <form
          action={formAction}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <div className="field">
            <label htmlFor="full_name">Nom complet</label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              defaultValue={user?.user_metadata?.full_name ?? ""}
              placeholder="Marie Dupont"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="email">Email (non modifiable)</label>
            <input
              id="email"
              type="email"
              value={user?.email ?? ""}
              disabled
              style={{ opacity: 0.6, cursor: "not-allowed", background: "var(--bg-soft)" }}
            />
          </div>

          <div className="field">
            <label htmlFor="phone">Téléphone (optionnel)</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={user?.user_metadata?.phone ?? ""}
              placeholder="+33 6 12 34 56 78"
            />
          </div>

          <div style={{ paddingTop: "8px" }}>
            <SubmitButton label="Enregistrer les modifications" loadingLabel="Enregistrement…" />
          </div>
        </form>

        {/* Account info */}
        <div
          style={{
            marginTop: "32px",
            paddingTop: "24px",
            borderTop: "1px solid var(--line)",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--display)",
              fontSize: "14px",
              fontWeight: 700,
              color: "var(--muted)",
              marginBottom: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Informations du compte
          </h3>
          <div style={{ fontSize: "13px", color: "var(--muted)", lineHeight: "2" }}>
            <div>
              <strong style={{ color: "var(--ink-soft)" }}>ID :</strong>{" "}
              <code style={{ fontSize: "12px", background: "var(--bg-soft)", padding: "2px 6px", borderRadius: "4px" }}>
                {user?.id ?? "—"}
              </code>
            </div>
            <div>
              <strong style={{ color: "var(--ink-soft)" }}>Compte créé le :</strong>{" "}
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
