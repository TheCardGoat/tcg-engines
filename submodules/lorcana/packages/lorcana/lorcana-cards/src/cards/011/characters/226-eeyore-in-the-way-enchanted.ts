import type { CharacterCard } from "@tcg/lorcana-types";
import { eeyoreInTheWay } from "./045-eeyore-in-the-way";

export const eeyoreInTheWayEnchanted: CharacterCard = {
  ...eeyoreInTheWay,
  id: "BB1",
  reprints: ["set11-045"],
  set: "011",
  cardNumber: 226,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_758bab20496f4673991e53ac59f1bcaa",
    tcgPlayer: 675279,
  },
};
