import type { ActionCard } from "@tcg/lorcana-types";
import { lookAtThisFamily as canonicalLookAtThisFamily } from "../../004";

export const lookAtThisFamily: ActionCard = {
  ...canonicalLookAtThisFamily,
  id: "fT0",
  reprints: ["set4-028", "set9-025"],
  set: "009",
  cardNumber: 25,
  rarity: "rare",
  externalIds: {
    lorcast: "crd_c8a627814d404f46ad87c09ece866017",
    tcgPlayer: 649973,
  },
};
