import type { CharacterCard } from "@tcg/lorcana-types";
import { theHornedKingTriumphantGhoul } from "./049-the-horned-king-triumphant-ghoul";

export const theHornedKingTriumphantGhoulEpic: CharacterCard = {
  ...theHornedKingTriumphantGhoul,
  id: "GxF",
  reprints: ["set10-049"],
  set: "010",
  cardNumber: 210,
  rarity: "common",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_ffc221e006704b97a8b62c29180b33b2",
    tcgPlayer: 658323,
  },
};
