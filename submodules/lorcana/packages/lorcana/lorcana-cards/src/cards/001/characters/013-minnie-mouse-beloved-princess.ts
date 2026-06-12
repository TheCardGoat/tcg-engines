import type { CharacterCard } from "@tcg/lorcana-types";
import { minnieMouseBelovedPrincessI18n } from "./013-minnie-mouse-beloved-princess.i18n";

export const minnieMouseBelovedPrincess: CharacterCard = {
  id: "c9i",
  canonicalId: "ci_c9i",
  reprints: ["set1-013"],
  cardType: "character",
  name: "Minnie Mouse",
  version: "Beloved Princess",
  inkType: ["amber"],
  set: "001",
  cardNumber: 13,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_e40a35d966914476b267935d79337667",
    tcgPlayer: 493498,
  },
  classifications: ["Dreamborn", "Princess"],
  i18n: minnieMouseBelovedPrincessI18n,
};
