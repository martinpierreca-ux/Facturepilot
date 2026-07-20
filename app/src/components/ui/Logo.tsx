import Link from "next/link";

interface LogoProps {
  href?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ href = "/", size = "md" }: LogoProps) {
  const sizes = {
    sm: { fontSize: "17px", gap: "8px" },
    md: { fontSize: "20px", gap: "10px" },
    lg: { fontSize: "26px", gap: "12px" },
  };

  const s = sizes[size];

  const logo = (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: s.gap,
        fontFamily: "var(--display)",
        fontWeight: 700,
        fontSize: s.fontSize,
        letterSpacing: "-0.03em",
        color: "var(--ink)",
        textDecoration: "none",
      }}
    >
      <span
        style={{
          background: "linear-gradient(120deg, #19b257, #0f7a37)",
          color: "#fff",
          borderRadius: "9px",
          width: size === "lg" ? "38px" : "32px",
          height: size === "lg" ? "38px" : "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          fontSize: size === "lg" ? "18px" : "15px",
          boxShadow: "var(--glow)",
          flexShrink: 0,
        }}
      >
        F
      </span>
      Facture<span style={{ color: "var(--green)" }}>Pilot</span>
    </span>
  );

  return href ? <Link href={href}>{logo}</Link> : logo;
}
