import type { CharacterCard } from "@tcg/lorcana-types";
import { annaBravingTheStorm as canonicalAnnaBravingTheStorm } from "../../004";

export const annaBravingTheStorm: CharacterCard = {
  ...canonicalAnnaBravingTheStorm,
  id: "rAH",
  reprints: ["set4-137", "set9-146"],
  set: "009",
  cardNumber: 146,
  rarity: "common",
  externalIds: {
    lorcast: "crd_d911158c4175449e9814484f3c5adb06",
    tcgPlayer: 650153,
  },
};
