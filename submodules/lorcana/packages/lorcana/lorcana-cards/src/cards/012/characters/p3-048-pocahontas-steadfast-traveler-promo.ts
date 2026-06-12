import type { CharacterCard } from "@tcg/lorcana-types";
import { pocahontasSteadfastTravelerP3PromoI18n } from "./p3-048-pocahontas-steadfast-traveler-promo.i18n";
import { pocahontasSteadfastTraveler } from "./171-pocahontas-steadfast-traveler";

export const pocahontasSteadfastTravelerP3Promo: CharacterCard = {
  ...pocahontasSteadfastTraveler,
  id: "876",
  set: "P03",
  cardNumber: 48,
  rarity: "special",
  specialRarity: "promo",
  i18n: pocahontasSteadfastTravelerP3PromoI18n,
};
