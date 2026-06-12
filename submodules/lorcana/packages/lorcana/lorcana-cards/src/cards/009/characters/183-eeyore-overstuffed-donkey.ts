import type { CharacterCard } from "@tcg/lorcana-types";
import { eeyoreOverstuffedDonkey as canonicalEeyoreOverstuffedDonkey } from "../../003";

export const eeyoreOverstuffedDonkey: CharacterCard = {
  ...canonicalEeyoreOverstuffedDonkey,
  id: "5Xs",
  reprints: ["set3-172", "set9-183"],
  set: "009",
  cardNumber: 183,
  rarity: "common",
  externalIds: {
    lorcast: "crd_214cf74b7c2e445282009e4d227b2519",
    tcgPlayer: 650116,
  },
};
