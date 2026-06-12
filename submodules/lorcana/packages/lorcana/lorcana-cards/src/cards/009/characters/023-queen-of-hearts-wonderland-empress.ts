import type { CharacterCard } from "@tcg/lorcana-types";
import { queenOfHeartsWonderlandEmpress as canonicalQueenOfHeartsWonderlandEmpress } from "../../003";

export const queenOfHeartsWonderlandEmpress: CharacterCard = {
  ...canonicalQueenOfHeartsWonderlandEmpress,
  id: "rL3",
  reprints: ["set3-020", "set9-023"],
  set: "009",
  cardNumber: 23,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_8da184a94db34eee8c9b4cc378a58d11",
    tcgPlayer: 649971,
  },
};
