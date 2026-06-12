import type { CharacterCard } from "@tcg/lorcana-types";
import { pinocchioStringsAttached } from "./061-pinocchio-strings-attached";

export const pinocchioStringsAttachedEpic: CharacterCard = {
  ...pinocchioStringsAttached,
  id: "QOp",
  reprints: ["set8-061"],
  set: "008",
  cardNumber: 224,
  rarity: "legendary",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_a0a931cb7b6248b3a56080e7f39b7e2b",
    tcgPlayer: 631340,
  },
};
