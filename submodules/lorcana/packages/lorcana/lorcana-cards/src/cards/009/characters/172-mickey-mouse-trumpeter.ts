import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseTrumpeter as canonicalMickeyMouseTrumpeter } from "../../003";

export const mickeyMouseTrumpeter: CharacterCard = {
  ...canonicalMickeyMouseTrumpeter,
  id: "lmM",
  reprints: ["set3-182", "set9-172"],
  set: "009",
  cardNumber: 172,
  rarity: "common",
  externalIds: {
    lorcast: "crd_631c3f90c74b4c0cabded03d2b07f85b",
    tcgPlayer: 650106,
  },
};
