import type { CharacterCard } from "@tcg/lorcana-types";
import { aliceGrowingGirl as canonicalAliceGrowingGirl } from "../../002";

export const aliceGrowingGirl: CharacterCard = {
  ...canonicalAliceGrowingGirl,
  id: "mKB",
  reprints: ["set2-137", "set9-160"],
  set: "009",
  cardNumber: 160,
  rarity: "common",
  externalIds: {
    lorcast: "crd_8619541a52554ab3b8a32dcaf795748e",
    tcgPlayer: 647672,
  },
};
