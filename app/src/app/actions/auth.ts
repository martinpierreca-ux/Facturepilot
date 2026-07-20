"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type AuthState = {
  error?: string;
  success?: string;
};

export async function login(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Veuillez remplir tous les champs." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      return { error: "Email ou mot de passe incorrect." };
    }
    if (error.message.includes("Email not confirmed")) {
      return {
        error:
          "Votre email n'est pas encore confirmé. Vérifiez votre boîte mail.",
      };
    }
    return { error: "Une erreur est survenue. Réessayez." };
  }

  redirect("/");
}

export async function register(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;

  if (!email || !password || !fullName) {
    return { error: "Veuillez remplir tous les champs." };
  }

  if (password.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "Un compte existe déjà avec cet email." };
    }
    return { error: "Impossible de créer le compte. Réessayez." };
  }

  return {
    success:
      "Compte créé ! Vérifiez votre boîte mail pour confirmer votre adresse email.",
  };
}

export async function forgotPassword(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Veuillez saisir votre adresse email." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/reinitialiser-mot-de-passe`,
  });

  if (error) {
    return { error: "Impossible d'envoyer l'email. Réessayez." };
  }

  return {
    success:
      "Si cet email est associé à un compte, vous recevrez un lien de réinitialisation.",
  };
}

export async function resetPassword(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const password = formData.get("password") as string;
  const confirm = formData.get("confirm") as string;

  if (!password || !confirm) {
    return { error: "Veuillez remplir tous les champs." };
  }

  if (password !== confirm) {
    return { error: "Les mots de passe ne correspondent pas." };
  }

  if (password.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: "Impossible de mettre à jour le mot de passe. Réessayez." };
  }

  redirect("/");
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/connexion");
}

export async function updateProfile(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const fullName = formData.get("full_name") as string;
  const phone = formData.get("phone") as string;

  if (!fullName) {
    return { error: "Le nom est requis." };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Session expirée. Reconnectez-vous." };
  }

  const { error: authError } = await supabase.auth.updateUser({
    data: { full_name: fullName, phone },
  });

  if (authError) {
    return { error: "Impossible de mettre à jour le profil." };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      full_name: fullName,
      phone,
      updated_at: new Date().toISOString(),
    });

  if (profileError) {
    return { error: "Impossible de mettre à jour le profil." };
  }

  return { success: "Profil mis à jour avec succès." };
}
