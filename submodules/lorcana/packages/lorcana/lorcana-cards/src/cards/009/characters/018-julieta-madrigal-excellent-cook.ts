import type { CharacterCard } from "@tcg/lorcana-types";
import { julietaMadrigalExcellentCook as canonicalJulietaMadrigalExcellentCook } from "../../004";

export const julietaMadrigalExcellentCook: CharacterCard = {
  ...canonicalJulietaMadrigalExcellentCook,
  id: "yxp",
  reprints: ["set4-013", "set9-018"],
  set: "009",
  cardNumber: 18,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_e0516a7bb03e48249017bd27b84a9d92",
    tcgPlayer: 649966,
  },
};
