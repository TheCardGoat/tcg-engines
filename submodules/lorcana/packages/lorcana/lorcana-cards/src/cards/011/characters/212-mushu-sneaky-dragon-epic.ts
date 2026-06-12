import type { CharacterCard } from "@tcg/lorcana-types";
import { mushuSneakyDragon } from "./082-mushu-sneaky-dragon";

export const mushuSneakyDragonEpic: CharacterCard = {
  ...mushuSneakyDragon,
  id: "EZT",
  reprints: ["set11-082"],
  set: "011",
  cardNumber: 212,
  rarity: "common",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_239773eb4b194139916d4c31bba66356",
    tcgPlayer: 677147,
  },
};
