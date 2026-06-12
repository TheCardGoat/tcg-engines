import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseTrueFriend as canonicalMickeyMouseTrueFriend } from "../../001";

export const mickeyMouseTrueFriend: CharacterCard = {
  ...canonicalMickeyMouseTrueFriend,
  id: "TK7",
  reprints: ["set1-012", "set9-013"],
  set: "009",
  cardNumber: 13,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_da34abc7da464b338103666b1ca3d0f8",
    tcgPlayer: 649962,
  },
};
