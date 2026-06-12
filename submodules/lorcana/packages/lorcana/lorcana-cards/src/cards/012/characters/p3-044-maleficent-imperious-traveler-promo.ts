import type { CharacterCard } from "@tcg/lorcana-types";
import { maleficentImperiousTravelerP3PromoI18n } from "./p3-044-maleficent-imperious-traveler-promo.i18n";
import { maleficentImperiousTraveler } from "./055-maleficent-imperious-traveler";

export const maleficentImperiousTravelerP3Promo: CharacterCard = {
  ...maleficentImperiousTraveler,
  id: "NKp",
  set: "P03",
  cardNumber: 44,
  rarity: "special",
  specialRarity: "promo",
  i18n: maleficentImperiousTravelerP3PromoI18n,
};
