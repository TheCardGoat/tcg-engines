import type { CharacterCard } from "@tcg/lorcana-types";
import { cruellaDeVilFashionableCruiser as canonicalCruellaDeVilFashionableCruiser } from "../../002";

export const cruellaDeVilFashionableCruiser: CharacterCard = {
  ...canonicalCruellaDeVilFashionableCruiser,
  id: "6E0",
  reprints: ["set2-144", "set9-145"],
  set: "009",
  cardNumber: 145,
  rarity: "common",
  externalIds: {
    lorcast: "crd_f3478602630b4f20aed9e34d8ce4d995",
    tcgPlayer: 650080,
  },
};
