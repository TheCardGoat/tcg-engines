import type { CharacterCard } from "@tcg/lorcana-types";
import { maximusRelentlessStallion } from "./195-maximus-relentless-stallion";
import { maximusRelentlessStallionPD1PromoI18n } from "./pd1-008-maximus-relentless-stallion-promo.i18n";

export const maximusRelentlessStallionPD1Promo: CharacterCard = {
  ...maximusRelentlessStallion,
  id: "yg0",
  printings: [
    {
      id: "set13-pd1-008-promo",
      artId: "ci_b1z-promo",
      setCode: "set13",
      collectorNumber: "8",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  cardNumber: 8,
  rarity: "special",
  specialRarity: "promo",
  i18n: maximusRelentlessStallionPD1PromoI18n,
};
