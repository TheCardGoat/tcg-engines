import type { CharacterCard } from "@tcg/lorcana-types";
import { theQueenMirrorSeeker as canonicalTheQueenMirrorSeeker } from "../../003";

export const theQueenMirrorSeeker: CharacterCard = {
  ...canonicalTheQueenMirrorSeeker,
  id: "4aE",
  reprints: ["set3-156", "set9-149"],
  set: "009",
  cardNumber: 149,
  rarity: "uncommon",
  externalIds: {
    lorcast: "crd_2124e542c7de4cadb69cb6e1887547ee",
    tcgPlayer: 650154,
  },
};
