import type { CharacterCard } from "@tcg/lorcana-types";
import { liloRockStar } from "./017-lilo-rock-star";

export const liloRockStarEnchanted: CharacterCard = {
  ...liloRockStar,
  id: "wic",
  reprints: ["set11-017"],
  set: "011",
  cardNumber: 223,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_41acb92e0c494214949c72c409593b50",
    tcgPlayer: 677158,
  },
};
