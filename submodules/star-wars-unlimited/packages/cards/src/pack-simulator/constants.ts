import type { PackDefinition } from "@tcg/shared/pack-simulator";
import type { SwuRarity } from "@tcg/star-wars-unlimited-types";

/** Standard Star Wars: Unlimited booster pack layout. */
export const SWU_PACK_DEFINITION: PackDefinition = {
  name: "Star Wars: Unlimited Booster Pack",
  slots: [
    { slotType: "leader", count: 1 },
    { slotType: "base", count: 1 },
    { slotType: "common", count: 9 },
    { slotType: "uncommon", count: 3 },
    { slotType: "rarePlus", count: 1 },
    { slotType: "foil", count: 1 },
  ],
};

export const SWU_RARITIES: Record<string, SwuRarity> = {
  COMMON: "common",
  UNCOMMON: "uncommon",
  RARE: "rare",
  LEGENDARY: "legendary",
  SPECIAL: "special",
} as const;

/**
 * Pull-rate assumptions for the rare/legendary slot.
 * Legendary cards appear roughly once every 8 packs.
 */
export const RARE_PLUS_DISTRIBUTION = {
  LEGENDARY_CHANCE: 1 / 8,
  RARE_CHANCE: 7 / 8,
} as const;

/**
 * Variant pull-rate assumptions.
 * - Hyperspace: ~2 in 3 packs. Distributed across 16 slots -> ~1/24 per card.
 * - Showcase: ~1 in 288 packs, only on leader cards.
 *
 * These are approximations based on the original Spark of Rebellion release.
 * Later sets (A Lawless Time onward) guarantee at least one Hyperspace and one
 * Hyperspace-foil per pack.
 */
export const VARIANT_DISTRIBUTION = {
  HYPERSPACE_CHANCE_PER_CARD: 1 / 24,
  SHOWCASE_CHANCE_PER_LEADER: 1 / 288,
} as const;

export const SWU_ASPECTS = [
  "aggression",
  "command",
  "cunning",
  "heroism",
  "vigilance",
  "villainy",
] as const;

export type SwuAspect = (typeof SWU_ASPECTS)[number];
