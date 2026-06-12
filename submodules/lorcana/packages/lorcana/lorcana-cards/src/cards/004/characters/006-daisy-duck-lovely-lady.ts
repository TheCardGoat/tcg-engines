import type { CharacterCard } from "@tcg/lorcana-types";
import { daisyDuckLovelyLadyI18n } from "./006-daisy-duck-lovely-lady.i18n";

export const daisyDuckLovelyLady: CharacterCard = {
  id: "GPw",
  canonicalId: "ci_GPw",
  reprints: ["set4-006"],
  cardType: "character",
  name: "Daisy Duck",
  version: "Lovely Lady",
  inkType: ["amber"],
  set: "004",
  cardNumber: 6,
  rarity: "uncommon",
  cost: 1,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_2ea290775cb046cebfd884af9fd14fb6",
    tcgPlayer: 543910,
  },
  classifications: ["Dreamborn", "Ally"],
  i18n: daisyDuckLovelyLadyI18n,
};
