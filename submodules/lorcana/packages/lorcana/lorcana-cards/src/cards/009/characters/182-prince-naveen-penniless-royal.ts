import type { CharacterCard } from "@tcg/lorcana-types";
import { princeNaveenPennilessRoyal as canonicalPrinceNaveenPennilessRoyal } from "../../002";

export const princeNaveenPennilessRoyal: CharacterCard = {
  ...canonicalPrinceNaveenPennilessRoyal,
  id: "S0o",
  reprints: ["set2-191", "set9-182"],
  set: "009",
  cardNumber: 182,
  rarity: "common",
  externalIds: {
    lorcast: "crd_6bfaedf8350c4f27ad9c60c2ecb2c942",
    tcgPlayer: 650115,
  },
};
