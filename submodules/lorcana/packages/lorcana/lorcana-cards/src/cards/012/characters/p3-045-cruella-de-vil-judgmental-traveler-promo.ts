import type { CharacterCard } from "@tcg/lorcana-types";
import { cruellaDeVilJudgmentalTravelerP3PromoI18n } from "./p3-045-cruella-de-vil-judgmental-traveler-promo.i18n";
import { cruellaDeVilJudgmentalTraveler } from "./092-cruella-de-vil-judgmental-traveler";

export const cruellaDeVilJudgmentalTravelerP3Promo: CharacterCard = {
  ...cruellaDeVilJudgmentalTraveler,
  id: "464",
  set: "P03",
  cardNumber: 45,
  rarity: "special",
  specialRarity: "promo",
  i18n: cruellaDeVilJudgmentalTravelerP3PromoI18n,
};
