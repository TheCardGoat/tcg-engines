import type { CharacterCard } from "@tcg/lorcana-types";
import { theMouseQueenRulerOfMousedomI18n } from "./153-the-mouse-queen-ruler-of-mousedom.i18n";

export const theMouseQueenRulerOfMousedom: CharacterCard = {
  id: "SM3",
  canonicalId: "ci_SM3",
  reprints: ["set8-153"],
  cardType: "character",
  name: "The Mouse Queen",
  version: "Ruler of Mousedom",
  inkType: ["sapphire"],
  franchise: "Great Mouse Detective",
  set: "008",
  cardNumber: 153,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 6,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_eafad143336248a791556f90cc93192f",
    tcgPlayer: 631453,
  },
  classifications: ["Storyborn", "Ally", "Queen"],
  i18n: theMouseQueenRulerOfMousedomI18n,
};
