import type { CharacterCard } from "@tcg/lorcana-types";
import { flixMadrigalFunlovingFamilyManI18n } from "./009-flix-madrigal-fun-loving-family-man.i18n";

export const flixMadrigalFunlovingFamilyMan: CharacterCard = {
  id: "ROB",
  canonicalId: "ci_ROB",
  reprints: ["set4-009"],
  cardType: "character",
  name: "Félix Madrigal",
  version: "Fun-Loving Family Man",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "004",
  cardNumber: 9,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_294d9cff39f64e0394a0af134957afc3",
    tcgPlayer: 543896,
  },
  classifications: ["Storyborn", "Ally", "Madrigal"],
  i18n: flixMadrigalFunlovingFamilyManI18n,
};
