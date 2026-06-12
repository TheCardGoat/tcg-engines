import type { CharacterCard } from "@tcg/lorcana-types";
import { theQueenRegalMonarch as canonicalTheQueenRegalMonarch } from "../../002";

export const theQueenRegalMonarch: CharacterCard = {
  ...canonicalTheQueenRegalMonarch,
  id: "DZ8",
  reprints: ["set2-027", "set9-007"],
  set: "009",
  cardNumber: 7,
  rarity: "common",
  externalIds: {
    lorcast: "crd_94ecd20c33354dabb0cc32b7133133a9",
    tcgPlayer: 649956,
  },
};
