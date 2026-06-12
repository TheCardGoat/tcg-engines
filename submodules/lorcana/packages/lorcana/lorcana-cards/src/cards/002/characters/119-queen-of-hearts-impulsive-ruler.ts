import type { CharacterCard } from "@tcg/lorcana-types";
import { queenOfHeartsImpulsiveRulerI18n } from "./119-queen-of-hearts-impulsive-ruler.i18n";
import { rush } from "../../../helpers/abilities/rush";

export const queenOfHeartsImpulsiveRuler: CharacterCard = {
  id: "D0w",
  canonicalId: "ci_cCq",
  reprints: ["set2-119", "set9-123"],
  cardType: "character",
  name: "Queen of Hearts",
  version: "Impulsive Ruler",
  inkType: ["ruby"],
  franchise: "Alice in Wonderland",
  set: "002",
  cardNumber: 119,
  rarity: "uncommon",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_2eb6be8b7b7a4bd6b131eacfee97dbc0",
    tcgPlayer: 650058,
  },
  text: "Rush",
  classifications: ["Storyborn", "Villain", "Queen"],
  abilities: [rush],
  i18n: queenOfHeartsImpulsiveRulerI18n,
};
