import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "FacturePilot — Facturation simple pour freelances",
  description:
    "Créez vos devis et factures en 2 minutes. Logiciel de facturation pensé pour les freelances et auto-entrepreneurs français.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${bricolage.variable}`}>
      <body style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}>
        {children}
      </body>
    </html>
  );
}
