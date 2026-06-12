import { m } from "$lib/i18n/messages.js";

export type PatronTierId = "supporter" | "champion" | "legend" | "admin";

export interface PatronTierConfig {
  id: PatronTierId;
  name: () => string;
  color: string;
  glow: string;
  borderColor: string;
  icon: "star" | "gem" | "sparkles" | "shield";
}

export const patronTierConfigs: Record<PatronTierId, PatronTierConfig> = {
  supporter: {
    id: "supporter",
    name: () => m["patron_tier_supporter"]({}),
    color: "oklch(0.68 0.14 70)",
    glow: "oklch(0.68 0.14 70 / 0.32)",
    borderColor: "oklch(0.68 0.14 70 / 0.45)",
    icon: "star",
  },
  champion: {
    id: "champion",
    name: () => m["patron_tier_champion"]({}),
    color: "oklch(0.73 0.08 250)",
    glow: "oklch(0.73 0.08 250 / 0.3)",
    borderColor: "oklch(0.73 0.08 250 / 0.42)",
    icon: "gem",
  },
  legend: {
    id: "legend",
    name: () => m["patron_tier_legend"]({}),
    color: "oklch(0.78 0.13 90)",
    glow: "oklch(0.78 0.13 90 / 0.34)",
    borderColor: "oklch(0.78 0.13 90 / 0.5)",
    icon: "sparkles",
  },
  admin: {
    id: "admin",
    name: () => m["patron_tier_admin"]({}),
    color: "oklch(0.62 0.17 24)",
    glow: "oklch(0.62 0.17 24 / 0.3)",
    borderColor: "oklch(0.62 0.17 24 / 0.46)",
    icon: "shield",
  },
};

export function resolvePatronTierConfig(
  subscriptionTier: string | null | undefined,
): PatronTierConfig | null {
  switch ((subscriptionTier ?? "").trim().toLowerCase()) {
    case "tier1":
    case "tier2":
    case "supporter":
      return patronTierConfigs.supporter;
    case "tier3":
    case "champion":
      return patronTierConfigs.champion;
    case "tier4":
    case "tier6":
    case "legend":
      return patronTierConfigs.legend;
    case "tier5":
    case "admin":
      return patronTierConfigs.admin;
    default:
      return null;
  }
}
