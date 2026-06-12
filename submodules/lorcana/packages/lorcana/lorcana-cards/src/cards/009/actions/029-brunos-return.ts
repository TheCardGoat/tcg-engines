import type { ActionCard } from "@tcg/lorcana-types";
import { brunosReturn as canonicalBrunosReturn } from "../../004";

export const brunosReturn: ActionCard = {
  ...canonicalBrunosReturn,
  id: "c1X",
  reprints: ["set4-026", "set9-029"],
  set: "009",
  cardNumber: 29,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_abc3f1da50d04f768b1181878b17f8da",
    tcgPlayer: 649976,
  },
};
