import type { CharacterCard } from "@tcg/lorcana-types";
import { benjaGuardianOfTheDragonGem as canonicalBenjaGuardianOfTheDragonGem } from "../../002";

export const benjaGuardianOfTheDragonGem: CharacterCard = {
  ...canonicalBenjaGuardianOfTheDragonGem,
  id: "amr",
  reprints: ["set2-174", "set9-180"],
  set: "009",
  cardNumber: 180,
  rarity: "common",
  externalIds: {
    lorcast: "crd_66a2a59da61b4b54a92f25b54c375d93",
    tcgPlayer: 650113,
  },
};
