import type { CharacterCard } from "@tcg/lorcana-types";
import { shereKhanMenacingPredator as canonicalShereKhanMenacingPredator } from "../../002";

export const shereKhanMenacingPredator: CharacterCard = {
  ...canonicalShereKhanMenacingPredator,
  id: "wAd",
  reprints: ["set2-126", "set9-104"],
  set: "009",
  cardNumber: 104,
  rarity: "rare",
  externalIds: {
    lorcast: "crd_4245d44a1e8344e1878acd9002b813e0",
    tcgPlayer: 650042,
  },
};
