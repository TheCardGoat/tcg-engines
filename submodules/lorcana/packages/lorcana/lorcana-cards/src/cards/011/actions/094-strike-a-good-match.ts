import type { ActionCard } from "@tcg/lorcana-types";
import { strikeAGoodMatch as canonicalStrikeAGoodMatch } from "../../003";

export const strikeAGoodMatch: ActionCard = {
  ...canonicalStrikeAGoodMatch,
  id: "rZh",
  reprints: ["set3-096", "set11-094"],
  set: "011",
  cardNumber: 94,
  rarity: "common",
  externalIds: {
    lorcast: "crd_5423fd35369b41ebbfff99eeb1928fc4",
    tcgPlayer: 674693,
  },
};
