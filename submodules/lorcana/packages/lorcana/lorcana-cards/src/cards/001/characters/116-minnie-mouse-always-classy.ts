import type { CharacterCard } from "@tcg/lorcana-types";
import { minnieMouseAlwaysClassyI18n } from "./116-minnie-mouse-always-classy.i18n";

export const minnieMouseAlwaysClassy: CharacterCard = {
  id: "YPs",
  canonicalId: "ci_YPs",
  reprints: ["set1-116"],
  cardType: "character",
  name: "Minnie Mouse",
  version: "Always Classy",
  inkType: ["ruby"],
  set: "001",
  cardNumber: 116,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_3f9c08ed5eae46f98e593890c2ec975b",
    tcgPlayer: 505967,
  },
  classifications: ["Storyborn", "Hero"],
  i18n: minnieMouseAlwaysClassyI18n,
};
