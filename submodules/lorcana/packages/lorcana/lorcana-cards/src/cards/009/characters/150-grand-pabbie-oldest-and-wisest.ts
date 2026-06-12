import type { CharacterCard } from "@tcg/lorcana-types";
import { grandPabbieOldestAndWisest as canonicalGrandPabbieOldestAndWisest } from "../../002";

export const grandPabbieOldestAndWisest: CharacterCard = {
  ...canonicalGrandPabbieOldestAndWisest,
  id: "0Js",
  reprints: ["set2-148", "set9-150"],
  set: "009",
  cardNumber: 150,
  rarity: "rare",
  externalIds: {
    lorcast: "crd_fded826f4af24bb7aac039d15848173e",
    tcgPlayer: 650085,
  },
};
