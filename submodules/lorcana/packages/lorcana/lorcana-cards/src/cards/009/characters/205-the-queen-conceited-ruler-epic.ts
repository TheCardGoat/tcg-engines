import type { CharacterCard } from "@tcg/lorcana-types";
import { theQueenConceitedRuler } from "./001-the-queen-conceited-ruler";

export const theQueenConceitedRulerEpic: CharacterCard = {
  ...theQueenConceitedRuler,
  id: "4Tp",
  reprints: ["set9-001"],
  set: "009",
  cardNumber: 205,
  rarity: "common",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_61593ca4abb44723ae95ab9228e27aee",
    tcgPlayer: 650141,
  },
};
