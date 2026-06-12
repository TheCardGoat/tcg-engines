import type { CharacterCard } from "@tcg/lorcana-types";
import { olafHappyPassenger } from "./050-olaf-happy-passenger";

export const olafHappyPassengerEnchanted: CharacterCard = {
  ...olafHappyPassenger,
  id: "8vE",
  reprints: ["set5-050"],
  set: "005",
  cardNumber: 209,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_19b1f802f23a4673aac60e04df0fb2ba",
    tcgPlayer: 561994,
  },
};
