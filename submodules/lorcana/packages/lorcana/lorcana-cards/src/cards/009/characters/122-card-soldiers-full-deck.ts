import type { CharacterCard } from "@tcg/lorcana-types";
import { cardSoldiersFullDeck as canonicalCardSoldiersFullDeck } from "../../002";

export const cardSoldiersFullDeck: CharacterCard = {
  ...canonicalCardSoldiersFullDeck,
  id: "ToP",
  reprints: ["set2-105", "set9-122"],
  set: "009",
  cardNumber: 122,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_9da81e46cc0d47c186f220e4007b0fd4",
    tcgPlayer: 650057,
  },
};
