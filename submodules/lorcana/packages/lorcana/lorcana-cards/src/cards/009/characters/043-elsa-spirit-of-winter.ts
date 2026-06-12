import type { CharacterCard } from "@tcg/lorcana-types";
import { elsaSpiritOfWinter as canonicalElsaSpiritOfWinter } from "../../001";

export const elsaSpiritOfWinter: CharacterCard = {
  ...canonicalElsaSpiritOfWinter,
  id: "7oH",
  reprints: ["set1-042", "set9-043"],
  set: "009",
  cardNumber: 43,
  rarity: "legendary",
  externalIds: {
    lorcast: "crd_096f0a6be34a4134aaa682c768cceeec",
    tcgPlayer: 649990,
  },
};
