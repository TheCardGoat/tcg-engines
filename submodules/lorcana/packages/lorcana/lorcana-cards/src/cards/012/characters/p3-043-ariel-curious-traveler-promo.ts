import type { CharacterCard } from "@tcg/lorcana-types";
import { arielCuriousTravelerP3PromoI18n } from "./p3-043-ariel-curious-traveler-promo.i18n";
import { arielCuriousTraveler } from "./018-ariel-curious-traveler";

export const arielCuriousTravelerP3Promo: CharacterCard = {
  ...arielCuriousTraveler,
  id: "Zl0",
  set: "P03",
  cardNumber: 43,
  rarity: "special",
  specialRarity: "promo",
  i18n: arielCuriousTravelerP3PromoI18n,
};
