import type { CharacterCard } from "@tcg/lorcana-types";
import { annaLittleSister } from "./052-anna-little-sister";

export const annaLittleSisterEpic: CharacterCard = {
  ...annaLittleSister,
  id: "0ff",
  reprints: ["set11-052"],
  set: "011",
  cardNumber: 209,
  rarity: "common",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_9702c37c04864acd9912592d55d9dce0",
    tcgPlayer: 677145,
  },
};
