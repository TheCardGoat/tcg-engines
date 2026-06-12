import type { CharacterCard } from "@tcg/lorcana-types";
import { queenOfHeartsImpatientTravelerP3PromoI18n } from "./p3-046-queen-of-hearts-impatient-traveler-promo.i18n";
import { queenOfHeartsImpatientTraveler } from "./122-queen-of-hearts-impatient-traveler";

export const queenOfHeartsImpatientTravelerP3Promo: CharacterCard = {
  ...queenOfHeartsImpatientTraveler,
  id: "dHA",
  set: "P03",
  cardNumber: 46,
  rarity: "special",
  specialRarity: "promo",
  i18n: queenOfHeartsImpatientTravelerP3PromoI18n,
};
