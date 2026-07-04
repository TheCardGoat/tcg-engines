import type { CharacterCard } from "@tcg/lorcana-types";
import { booEnergeticChild } from "./127-boo-energetic-child";
import { booEnergeticChildPD1PromoI18n } from "./pd1-006-boo-energetic-child-promo.i18n";

export const booEnergeticChildPD1Promo: CharacterCard = {
  ...booEnergeticChild,
  id: "X9A",
  printings: [
    {
      id: "set13-pd1-006-promo",
      artId: "ci_X9A-promo",
      setCode: "set13",
      collectorNumber: "6",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  cardNumber: 6,
  rarity: "special",
  specialRarity: "promo",
  i18n: booEnergeticChildPD1PromoI18n,
};
