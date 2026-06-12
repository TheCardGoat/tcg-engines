import type { CharacterCard } from "@tcg/lorcana-types";
import { thomasWideeyedRecruitI18n } from "./001-thomas-wide-eyed-recruit.i18n";

export const thomasWideeyedRecruit: CharacterCard = {
  id: "685",
  canonicalId: "ci_685",
  reprints: ["set11-001"],
  cardType: "character",
  name: "Thomas",
  version: "Wide-Eyed Recruit",
  inkType: ["amber"],
  franchise: "Pocahontas",
  set: "011",
  cardNumber: 1,
  rarity: "common",
  cost: 1,
  strength: 0,
  willpower: 4,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_4baf2f3e2b1a4c8da121d3a0473684c5",
    tcgPlayer: 674816,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: thomasWideeyedRecruitI18n,
};
