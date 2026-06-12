import type { SubscriptionTier } from "./auth/types";

export type SupporterPerkTier = "tier2" | "tier3" | "tier4";

export type SupporterPerkConfig = {
  tier: SupporterPerkTier;
  publicTier: "supporter" | "champion" | "legend";
  monthlyInkmarks: number;
  cosmeticProgressMultiplier: number;
  eventTicketMultiplier: number;
  alternateArtAccess: boolean;
};

export const SUPPORTER_PERK_TIERS = [
  "tier2",
  "tier3",
  "tier4",
] as const satisfies readonly SupporterPerkTier[];

export const SUPPORTER_PERK_CONFIG = {
  tier2: {
    tier: "tier2",
    publicTier: "supporter",
    monthlyInkmarks: 50,
    cosmeticProgressMultiplier: 2,
    eventTicketMultiplier: 2,
    alternateArtAccess: false,
  },
  tier3: {
    tier: "tier3",
    publicTier: "champion",
    monthlyInkmarks: 100,
    cosmeticProgressMultiplier: 3,
    eventTicketMultiplier: 3,
    alternateArtAccess: false,
  },
  tier4: {
    tier: "tier4",
    publicTier: "legend",
    monthlyInkmarks: 150,
    cosmeticProgressMultiplier: 5,
    eventTicketMultiplier: 5,
    alternateArtAccess: true,
  },
} as const satisfies Record<SupporterPerkTier, SupporterPerkConfig>;

export const SUPPORTER_PERK_TIER_ALIASES = {
  tier1: "tier2",
  tier2: "tier2",
  tier3: "tier3",
  tier4: "tier4",
  tier5: "tier4",
  tier6: "tier4",
} as const satisfies Record<Exclude<SubscriptionTier, "free">, SupporterPerkTier>;

export const ATELIER_INKMARK_PRICE_ANCHORS = {
  permanentLegendaryInkmarks: 50,
  permanentEnchantedInkmarks: 120,
} as const;

export function normalizeSupporterPerkTier(
  tier: string | null | undefined,
): SupporterPerkTier | null {
  const normalized = (tier ?? "").trim().toLowerCase();
  if (normalized in SUPPORTER_PERK_TIER_ALIASES) {
    return SUPPORTER_PERK_TIER_ALIASES[normalized as keyof typeof SUPPORTER_PERK_TIER_ALIASES];
  }
  return null;
}

export function getSupporterPerks(tier: string | null | undefined): SupporterPerkConfig | null {
  const normalized = normalizeSupporterPerkTier(tier);
  return normalized ? SUPPORTER_PERK_CONFIG[normalized] : null;
}

export function getPatronGrantInkmarks(tier: string | null | undefined): number {
  return getSupporterPerks(tier)?.monthlyInkmarks ?? 0;
}

export function getCosmeticProgressMultiplier(tier: string | null | undefined): number {
  return getSupporterPerks(tier)?.cosmeticProgressMultiplier ?? 1;
}

export function getEventTicketMultiplier(tier: string | null | undefined): number {
  return getSupporterPerks(tier)?.eventTicketMultiplier ?? 1;
}

export function hasActiveAlternateArtAccess(tier: string | null | undefined): boolean {
  return getSupporterPerks(tier)?.alternateArtAccess ?? false;
}
