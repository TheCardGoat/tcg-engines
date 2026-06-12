import type { CharacterCard } from "@tcg/lorcana-types";
import { theQueenMirrorSeeker } from "../../003";

export const theQueenMirrorSeekerEpic: CharacterCard = {
  ...theQueenMirrorSeeker,
  id: "5AS",
  reprints: ["set3-156", "set9-149"],
  set: "009",
  cardNumber: 219,
  rarity: "common",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_2124e542c7de4cadb69cb6e1887547ee",
    tcgPlayer: 650154,
  },
};
