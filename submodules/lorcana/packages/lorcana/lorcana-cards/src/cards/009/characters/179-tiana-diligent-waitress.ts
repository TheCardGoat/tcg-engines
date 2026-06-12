import type { CharacterCard } from "@tcg/lorcana-types";
import { tianaDiligentWaitress as canonicalTianaDiligentWaitress } from "../../002";

export const tianaDiligentWaitress: CharacterCard = {
  ...canonicalTianaDiligentWaitress,
  id: "c2B",
  reprints: ["set2-197", "set9-179"],
  set: "009",
  cardNumber: 179,
  rarity: "common",
  externalIds: {
    lorcast: "crd_1843141c81254b5bb5dd3dfc7cc624dc",
    tcgPlayer: 650112,
  },
};
