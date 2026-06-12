import type { CharacterCard } from "@tcg/lorcana-types";
import { captainColonelsLieutenantI18n } from "./106-captain-colonels-lieutenant.i18n";

export const captainColonelsLieutenant: CharacterCard = {
  id: "lk3",
  canonicalId: "ci_lk3",
  reprints: ["set1-106"],
  cardType: "character",
  name: "Captain",
  version: "Colonel’s Lieutenant",
  inkType: ["ruby"],
  franchise: "101 Dalmatians",
  set: "001",
  cardNumber: 106,
  rarity: "uncommon",
  cost: 5,
  strength: 6,
  willpower: 5,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_6b4e0c325cbb46698922c45438b4f1a7",
    tcgPlayer: 508779,
  },
  classifications: ["Storyborn", "Ally", "Captain"],
  i18n: captainColonelsLieutenantI18n,
};
