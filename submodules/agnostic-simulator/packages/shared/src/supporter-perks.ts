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

/**
 * Rarity-code slot every game's rarest alt-art maps onto for pricing. Defined
 * locally because `agnostic-simulator/packages/shared` must not import the
 * platform `AltArtRarityCode` schema type (dependency direction is platform →
 * shared, not the reverse). The platform `AltArtGameAdapter.rarityCodeForPrinting`
 * is the runtime source of truth and must produce a value assignable to this
 * slot for the calibration to hold.
 */
export type AltArtCalibrationRarityCode = "enchanted";

/**
 * Cross-game alt-art pricing calibration.
 *
 * The atelier economy is shared across games (one Marks wallet). To keep
 * grinding feel equivalent across games, the RAREST alt-art in every game is
 * calibrated to the same permanent-marks target: acquiring the top alt-art in
 * Lorcana costs the same number of games as the top alt-art in Cyberpunk.
 *
 * Each game maps its rarest printings onto {@link ALT_ART_CALIBRATION_TARGET.topRarityCode}
 * via its `AltArtGameAdapter.rarityCodeForPrinting`, and the matching entry in
 * the platform `DEFAULT_PRICING` table equals
 * {@link ALT_ART_CALIBRATION_TARGET.topRarityPermanentMarks}. Season events may
 * override per-rarity, but this is the documented default anchor.
 *
 * Per-game satisfaction:
 * - Lorcana: natively — `enchanted` is the rarest `specialRarity` and
 *   `DEFAULT_PRICING.enchanted.permanent === 120` already.
 * - Cyberpunk: via the alt-art-set bump — printings in the `promo` and
 *   `boxtoppersretail` sets are mapped to the `enchanted` rarity code by the
 *   Cyberpunk AltArtGameAdapter, so they inherit the same 120-mark price.
 *
 * `topRarityPermanentMarks` is the shared X (games-to-acquire target divided by
 * the baseline earn rate). With the default 1 mark/game earn rate this is ~120
 * games gross (≈12 days at the daily-10 cap).
 *
 * The actual per-game rarity→price tables stay in
 * `apps/general-api/src/modules/atelier/pricing-resolver.ts::DEFAULT_PRICING`,
 * which is load-time asserted against this anchor so the two cannot drift.
 */
export const ALT_ART_CALIBRATION_TARGET = {
  /** Permanent-marks price every game's rarest alt-art maps onto. */
  topRarityPermanentMarks: 120,
  /** The rarity code each game's top tier maps onto (drives DEFAULT_PRICING lookup). */
  topRarityCode: "enchanted",
} as const satisfies {
  topRarityPermanentMarks: number;
  topRarityCode: AltArtCalibrationRarityCode;
};

/**
 * Per-game statement of which rarity code each game treats as its rarest
 * alt-art tier, so the calibration is auditable in one place. The platform
 * `AltArtGameAdapter.rarityCodeForPrinting` is the runtime source of truth;
 * this table documents the intent and must stay in sync with the adapters.
 *
 * Every value MUST equal {@link ALT_ART_CALIBRATION_TARGET.topRarityCode} for
 * the cross-game calibration invariant to hold.
 */
export const ALT_ART_TOP_RARITY_BY_GAME: Readonly<Record<string, AltArtCalibrationRarityCode>> = {
  lorcana: "enchanted", // Enchanted rarity (specialRarity: enchanted)
  cyberpunk: "enchanted", // promo + boxtoppersretail + boxtoppersbeta alt-art sets bump to enchanted
};

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
