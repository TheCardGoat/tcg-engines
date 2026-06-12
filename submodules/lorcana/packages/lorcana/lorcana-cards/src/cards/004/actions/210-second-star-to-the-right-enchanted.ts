import type { ActionCard } from "@tcg/lorcana-types";
import { secondStarToTheRight } from "./061-second-star-to-the-right";

export const secondStarToTheRightEnchanted: ActionCard = {
  ...secondStarToTheRight,
  id: "aC3",
  reprints: ["set4-061", "set9-060"],
  set: "004",
  cardNumber: 210,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_07d43fd911d2476caa9c4aa982d29405",
    tcgPlayer: 650004,
  },
};
