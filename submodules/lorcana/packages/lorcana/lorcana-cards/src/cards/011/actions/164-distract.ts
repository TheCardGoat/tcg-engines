import type { ActionCard } from "@tcg/lorcana-types";
import { distract as canonicalDistract } from "../../003";

export const distract: ActionCard = {
  ...canonicalDistract,
  id: "d5v",
  reprints: ["set3-159", "set11-164"],
  set: "011",
  cardNumber: 164,
  rarity: "common",
  externalIds: {
    lorcast: "crd_8ca0325f7667410d8b83628e02028294",
    tcgPlayer: 676228,
  },
};
