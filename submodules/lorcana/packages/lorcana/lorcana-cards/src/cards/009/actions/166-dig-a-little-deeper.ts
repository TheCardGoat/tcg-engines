import type { ActionCard } from "@tcg/lorcana-types";
import { digALittleDeeper as canonicalDigALittleDeeper } from "../../004";

export const digALittleDeeper: ActionCard = {
  ...canonicalDigALittleDeeper,
  id: "sFO",
  reprints: ["set4-162", "set9-166"],
  set: "009",
  cardNumber: 166,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_7dc546270337447fb4c4bac833fc4c17",
    tcgPlayer: 650100,
  },
};
