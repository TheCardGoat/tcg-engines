import type { CharacterCard } from "@tcg/lorcana-types";
import { queenOfHeartsImpulsiveRulerI18n } from "./123-queen-of-hearts-impulsive-ruler.i18n";

import { rush } from "../../../helpers/abilities/rush";

export const queenOfHeartsImpulsiveRuler: CharacterCard = {
  id: "sTx",
  canonicalId: "ci_cCq",
  slug: "lorcana-ci_cCq",
  printings: [
    {
      id: "set9-123",
      artId: "set9-123",
      setCode: "set9",
      collectorNumber: "123",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set2-119", "set9-123"],
  cardType: "character",
  name: "Queen of Hearts",
  version: "Impulsive Ruler",
  inkType: ["ruby"],
  franchise: "Alice in Wonderland",
  set: "009",
  cardNumber: 123,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_2eb6be8b7b7a4bd6b131eacfee97dbc0",
    tcgPlayer: "650058",
  },
  text: "Rush",
  classifications: ["Storyborn", "Villain", "Queen"],
  abilities: [rush],
  i18n: queenOfHeartsImpulsiveRulerI18n,
};
