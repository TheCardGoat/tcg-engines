import type { ActionCard } from "@tcg/lorcana-types";
import { lookAtThisFamily } from "./028-look-at-this-family";

export const lookAtThisFamilyEnchanted: ActionCard = {
  ...lookAtThisFamily,
  id: "M3W",
  reprints: ["set4-028", "set9-025"],
  set: "004",
  cardNumber: 207,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_c8a627814d404f46ad87c09ece866017",
    tcgPlayer: 649973,
  },
};
