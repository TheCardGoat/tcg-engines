import { INK_TYPES, type InkType } from "@tcg/lorcana-types";

/** Standard Lorcana booster pack layout. */
export const LORCANA_PACK_DEFINITION = {
  name: "Lorcana Booster Pack",
  slots: [
    { slotType: "common", count: 6 },
    { slotType: "uncommon", count: 3 },
    { slotType: "rarePlus", count: 2 },
    { slotType: "foil", count: 1 },
  ],
} as const;

export const LORCANA_INK_TYPES = [...INK_TYPES] as const;

export type LorcanaInkType = InkType;

/** Canonical rarity keys used on Lorcana card definitions. */
export const LORCANA_RARITIES = {
  COMMON: "common",
  UNCOMMON: "uncommon",
  RARE: "rare",
  SUPER_RARE: "super_rare",
  LEGENDARY: "legendary",
  ENCHANTED: "enchanted",
} as const;

/** Probability distribution for the two rare+ slots. */
export const RARE_PLUS_DISTRIBUTION = {
  LEGENDARY_CHANCE: 0.1,
  SUPER_RARE_CHANCE: 0.225,
  RARE_CHANCE: 0.675,
} as const;

/** Cumulative percentage distribution for the foil slot. */
export const FOIL_DISTRIBUTION = {
  ENCHANTED: 1,
  LEGENDARY: 3,
  SUPER_RARE: 7,
  RARE: 17,
  UNCOMMON: 42,
  // Common covers the remaining 58%.
} as const;
