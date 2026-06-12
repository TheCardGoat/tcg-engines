import type { ActionCard } from "@tcg/lorcana-types";
import { secondStarToTheRight as canonicalSecondStarToTheRight } from "../../004";

export const secondStarToTheRight: ActionCard = {
  ...canonicalSecondStarToTheRight,
  id: "jXk",
  reprints: ["set4-061", "set9-060"],
  set: "009",
  cardNumber: 60,
  rarity: "rare",
  externalIds: {
    lorcast: "crd_07d43fd911d2476caa9c4aa982d29405",
    tcgPlayer: 650004,
  },
};
