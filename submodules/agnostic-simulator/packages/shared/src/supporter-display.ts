export type SupporterPublicTier = "supporter" | "champion" | "legend" | "admin";

export type SupporterIconName = "star" | "gem" | "sparkles" | "shield";

export interface SupporterDisplayConfig {
  publicTier: SupporterPublicTier;
  label: string;
  shortLabel: string;
  icon: SupporterIconName;
  color: string;
  colorRgb: string;
  background: string;
  border: string;
  glow: string;
}

export const SUPPORTER_DISPLAY_CONFIGS: Record<SupporterPublicTier, SupporterDisplayConfig> = {
  supporter: {
    publicTier: "supporter",
    label: "Supporter",
    shortLabel: "Supporter",
    icon: "star",
    color: "oklch(0.68 0.14 70)",
    colorRgb: "204 137 48",
    background: "oklch(0.68 0.14 70 / 0.12)",
    border: "oklch(0.68 0.14 70 / 0.45)",
    glow: "oklch(0.68 0.14 70 / 0.32)",
  },
  champion: {
    publicTier: "champion",
    label: "Champion",
    shortLabel: "Champion",
    icon: "gem",
    color: "oklch(0.73 0.08 250)",
    colorRgb: "104 166 221",
    background: "oklch(0.73 0.08 250 / 0.12)",
    border: "oklch(0.73 0.08 250 / 0.42)",
    glow: "oklch(0.73 0.08 250 / 0.3)",
  },
  legend: {
    publicTier: "legend",
    label: "Legend",
    shortLabel: "Legend",
    icon: "sparkles",
    color: "oklch(0.78 0.13 90)",
    colorRgb: "218 178 63",
    background: "oklch(0.78 0.13 90 / 0.14)",
    border: "oklch(0.78 0.13 90 / 0.5)",
    glow: "oklch(0.78 0.13 90 / 0.34)",
  },
  admin: {
    publicTier: "admin",
    label: "Admin",
    shortLabel: "Admin",
    icon: "shield",
    color: "oklch(0.62 0.17 24)",
    colorRgb: "201 79 66",
    background: "oklch(0.62 0.17 24 / 0.12)",
    border: "oklch(0.62 0.17 24 / 0.46)",
    glow: "oklch(0.62 0.17 24 / 0.3)",
  },
};

export function normalizeSupporterTier(
  tier: string | null | undefined,
): SupporterPublicTier | null {
  switch ((tier ?? "").trim().toLowerCase()) {
    case "tier1":
    case "tier2":
    case "supporter":
      return "supporter";
    case "tier3":
    case "champion":
      return "champion";
    case "tier4":
    case "tier6":
    case "legend":
      return "legend";
    case "tier5":
    case "admin":
      return "admin";
    default:
      return null;
  }
}

export function getSupporterDisplayConfig(
  tier: string | null | undefined,
): SupporterDisplayConfig | null {
  const publicTier = normalizeSupporterTier(tier);
  return publicTier ? SUPPORTER_DISPLAY_CONFIGS[publicTier] : null;
}

export function isVisibleSupporterTier(tier: string | null | undefined): boolean {
  return getSupporterDisplayConfig(tier) !== null;
}

export function formatSupporterAriaLabel(name: string, tier: string | null | undefined): string {
  const config = getSupporterDisplayConfig(tier);
  return config ? `${name}, ${config.label}` : name;
}
