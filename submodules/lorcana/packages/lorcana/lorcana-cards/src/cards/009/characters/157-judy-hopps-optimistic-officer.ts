import type { CharacterCard } from "@tcg/lorcana-types";
import { judyHoppsOptimisticOfficer as canonicalJudyHoppsOptimisticOfficer } from "../../002";

export const judyHoppsOptimisticOfficer: CharacterCard = {
  ...canonicalJudyHoppsOptimisticOfficer,
  id: "64b",
  reprints: ["set2-152", "set9-157"],
  set: "009",
  cardNumber: 157,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_bb0a1c04d9ed4941a9cda16b55a05da9",
    tcgPlayer: 650092,
  },
};
