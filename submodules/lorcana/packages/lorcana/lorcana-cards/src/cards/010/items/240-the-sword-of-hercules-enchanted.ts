import type { ItemCard } from "@tcg/lorcana-types";
import { theSwordOfHercules } from "./200-the-sword-of-hercules";

export const theSwordOfHerculesEnchanted: ItemCard = {
  ...theSwordOfHercules,
  id: "1Wc",
  reprints: ["set10-200"],
  set: "010",
  cardNumber: 240,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_70fa88bf3a35452b8178209944e8604a",
    tcgPlayer: 660031,
  },
};
