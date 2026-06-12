import type { CharacterCard } from "@tcg/lorcana-types";
import { eudoraAccomplishedSeamstressI18n } from "./007-eudora-accomplished-seamstress.i18n";

export const eudoraAccomplishedSeamstress: CharacterCard = {
  id: "3Gy",
  canonicalId: "ci_3Gy",
  reprints: ["set2-007"],
  cardType: "character",
  name: "Eudora",
  version: "Accomplished Seamstress",
  inkType: ["amber"],
  franchise: "Princess and the Frog",
  set: "002",
  cardNumber: 7,
  rarity: "common",
  cost: 5,
  strength: 1,
  willpower: 9,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_1c8429d7ddbe4e4895be3442a801c039",
    tcgPlayer: 527710,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: eudoraAccomplishedSeamstressI18n,
};
