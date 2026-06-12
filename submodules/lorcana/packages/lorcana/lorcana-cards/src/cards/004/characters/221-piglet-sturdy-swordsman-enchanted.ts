import type { CharacterCard } from "@tcg/lorcana-types";
import { pigletSturdySwordsman } from "./191-piglet-sturdy-swordsman";

export const pigletSturdySwordsmanEnchanted: CharacterCard = {
  ...pigletSturdySwordsman,
  id: "WaO",
  reprints: ["set4-191"],
  set: "004",
  cardNumber: 221,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_8ac9f95c19af4213b7c6aed341965206",
    tcgPlayer: 550721,
  },
};
