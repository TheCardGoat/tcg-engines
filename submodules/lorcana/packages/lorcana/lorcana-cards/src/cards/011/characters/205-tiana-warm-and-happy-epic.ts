import type { CharacterCard } from "@tcg/lorcana-types";
import { tianaWarmAndHappy } from "./005-tiana-warm-and-happy";

export const tianaWarmAndHappyEpic: CharacterCard = {
  ...tianaWarmAndHappy,
  id: "BEO",
  reprints: ["set11-005"],
  set: "011",
  cardNumber: 205,
  rarity: "common",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_801cd6ba9a3048499af41d6186fa4100",
    tcgPlayer: 677142,
  },
};
