import type { ActionCard } from "@tcg/lorcana-types";
import { strengthOfARagingFire as canonicalStrengthOfARagingFire } from "../../002";

export const strengthOfARagingFire: ActionCard = {
  ...canonicalStrengthOfARagingFire,
  id: "sQ9",
  reprints: ["set2-201", "set9-201"],
  set: "009",
  cardNumber: 201,
  rarity: "rare",
  externalIds: {
    lorcast: "crd_0f4ad89d1f5348b0ae5b8d6010dc70d9",
    tcgPlayer: 647674,
  },
};
