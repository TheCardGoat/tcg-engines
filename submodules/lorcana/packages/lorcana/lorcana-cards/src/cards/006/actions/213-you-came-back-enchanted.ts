import type { ActionCard } from "@tcg/lorcana-types";
import { youCameBack } from "./097-you-came-back";

export const youCameBackEnchanted: ActionCard = {
  ...youCameBack,
  id: "8ys",
  reprints: ["set6-097"],
  set: "006",
  cardNumber: 213,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_b29e4a26e9324724aab37e97a7738476",
    tcgPlayer: 591998,
  },
};
