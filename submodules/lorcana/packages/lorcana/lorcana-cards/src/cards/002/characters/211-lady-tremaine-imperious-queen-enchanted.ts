import type { CharacterCard } from "@tcg/lorcana-types";
import { ladyTremaineImperiousQueen } from "./110-lady-tremaine-imperious-queen";

export const ladyTremaineImperiousQueenEnchanted: CharacterCard = {
  ...ladyTremaineImperiousQueen,
  id: "SlK",
  reprints: ["set2-110"],
  set: "002",
  cardNumber: 211,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_e08d7a85c4e84f1e83a7521ff9c15a89",
    tcgPlayer: 528109,
  },
};
