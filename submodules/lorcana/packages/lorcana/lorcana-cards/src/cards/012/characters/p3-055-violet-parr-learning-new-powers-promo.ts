import type { CharacterCard } from "@tcg/lorcana-types";
import { violetParrLearningNewPowersP3PromoI18n } from "./p3-055-violet-parr-learning-new-powers-promo.i18n";
import { violetParrLearningNewPowers } from "./048-violet-parr-learning-new-powers";

export const violetParrLearningNewPowersP3Promo: CharacterCard = {
  ...violetParrLearningNewPowers,
  id: "Fdq",
  set: "P03",
  cardNumber: 55,
  rarity: "special",
  specialRarity: "promo",
  i18n: violetParrLearningNewPowersP3PromoI18n,
};
