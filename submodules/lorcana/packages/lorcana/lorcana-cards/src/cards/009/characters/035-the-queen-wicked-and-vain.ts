import type { CharacterCard } from "@tcg/lorcana-types";
import { theQueenWickedAndVain as canonicalTheQueenWickedAndVain } from "../../001";

export const theQueenWickedAndVain: CharacterCard = {
  ...canonicalTheQueenWickedAndVain,
  id: "hNb",
  reprints: ["set1-056", "set9-035"],
  set: "009",
  cardNumber: 35,
  rarity: "rare",
  externalIds: {
    lorcast: "crd_ab6a9775bfbb446bb03724f1f7ba0f3a",
    tcgPlayer: 649982,
  },
};
