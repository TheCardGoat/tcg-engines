import type { ActionCard } from "@tcg/lorcana-types";
import { motherKnowsBest as canonicalMotherKnowsBest } from "../../001";

export const motherKnowsBest: ActionCard = {
  ...canonicalMotherKnowsBest,
  id: "2E9",
  reprints: ["set1-095", "set9-099"],
  set: "009",
  cardNumber: 99,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_39a0e5d019794fcd9a96be1309addb7c",
    tcgPlayer: 650037,
  },
};
