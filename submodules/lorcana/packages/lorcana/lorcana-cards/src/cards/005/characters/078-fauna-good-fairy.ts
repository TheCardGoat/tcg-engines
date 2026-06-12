import type { CharacterCard } from "@tcg/lorcana-types";
import { faunaGoodFairyI18n } from "./078-fauna-good-fairy.i18n";

export const faunaGoodFairy: CharacterCard = {
  id: "Frg",
  canonicalId: "ci_Frg",
  reprints: ["set5-078"],
  cardType: "character",
  name: "Fauna",
  version: "Good Fairy",
  inkType: ["emerald"],
  franchise: "Sleeping Beauty",
  set: "005",
  cardNumber: 78,
  rarity: "common",
  cost: 5,
  strength: 3,
  willpower: 7,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_f67695810a434de2af182783cbd167e9",
    tcgPlayer: 561167,
  },
  classifications: ["Storyborn", "Ally", "Fairy"],
  i18n: faunaGoodFairyI18n,
};
