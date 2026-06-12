import type { CharacterCard } from "@tcg/lorcana-types";
import { aladdinCorneredSwordsmanI18n } from "./171-aladdin-cornered-swordsman.i18n";

export const aladdinCorneredSwordsman: CharacterCard = {
  id: "K3y",
  canonicalId: "ci_K3y",
  reprints: ["set1-171"],
  cardType: "character",
  name: "Aladdin",
  version: "Cornered Swordsman",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "001",
  cardNumber: 171,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_cabcdb68fdc14360a495869d3e7fc281",
    tcgPlayer: 508895,
  },
  classifications: ["Storyborn", "Hero"],
  i18n: aladdinCorneredSwordsmanI18n,
};
