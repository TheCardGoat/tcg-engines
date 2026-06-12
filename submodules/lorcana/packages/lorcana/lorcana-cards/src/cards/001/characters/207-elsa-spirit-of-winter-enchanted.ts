import type { CharacterCard } from "@tcg/lorcana-types";
import { elsaSpiritOfWinter } from "./042-elsa-spirit-of-winter";

export const elsaSpiritOfWinterEnchanted: CharacterCard = {
  ...elsaSpiritOfWinter,
  id: "yio",
  reprints: ["set1-042", "set9-043"],
  set: "001",
  cardNumber: 207,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_096f0a6be34a4134aaa682c768cceeec",
    tcgPlayer: 649990,
  },
};
