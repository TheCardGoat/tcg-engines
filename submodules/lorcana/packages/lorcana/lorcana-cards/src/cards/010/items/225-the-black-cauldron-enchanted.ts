import type { ItemCard } from "@tcg/lorcana-types";
import { theBlackCauldron } from "./032-the-black-cauldron.js";

export const theBlackCauldronEnchanted: ItemCard = {
  ...theBlackCauldron,
  id: "WLA",
  reprints: ["set10-032"],
  set: "010",
  cardNumber: 225,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_24dfd54db49e4a5d8004c51d0882aa46",
    tcgPlayer: 658884,
  },
};
