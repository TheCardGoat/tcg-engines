import type { CharacterCard } from "@tcg/lorcana-types";
import { queenOfHeartsImpulsiveRuler as canonicalQueenOfHeartsImpulsiveRuler } from "../../002";

export const queenOfHeartsImpulsiveRuler: CharacterCard = {
  ...canonicalQueenOfHeartsImpulsiveRuler,
  id: "7jf",
  reprints: ["set2-119", "set9-123"],
  set: "009",
  cardNumber: 123,
  rarity: "common",
  externalIds: {
    lorcast: "crd_2eb6be8b7b7a4bd6b131eacfee97dbc0",
    tcgPlayer: 650058,
  },
};
