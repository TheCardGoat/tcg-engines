import type { CharacterCard } from "@tcg/lorcana-types";
import { rapunzelLettingDownHerHair as canonicalRapunzelLettingDownHerHair } from "../../001";

export const rapunzelLettingDownHerHair: CharacterCard = {
  ...canonicalRapunzelLettingDownHerHair,
  id: "1J0",
  reprints: ["set1-121", "set9-124"],
  set: "009",
  cardNumber: 124,
  rarity: "common",
  externalIds: {
    lorcast: "crd_cdba0ed02d3a4361afb0aaa7689ee1de",
    tcgPlayer: 650059,
  },
};
