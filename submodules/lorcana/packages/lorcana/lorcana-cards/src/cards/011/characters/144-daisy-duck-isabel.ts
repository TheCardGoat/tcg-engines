import type { CharacterCard } from "@tcg/lorcana-types";
import { daisyDuckIsabelI18n } from "./144-daisy-duck-isabel.i18n";

export const daisyDuckIsabel: CharacterCard = {
  id: "mVm",
  canonicalId: "ci_mVm",
  reprints: ["set11-144"],
  cardType: "character",
  name: "Daisy Duck",
  version: "Isabel",
  inkType: ["sapphire"],
  franchise: "Mickey's Christmas Carol",
  set: "011",
  cardNumber: 144,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 3,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_44777bc0e3f44e018e9fad2f10644de8",
    tcgPlayer: 676222,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: daisyDuckIsabelI18n,
};
