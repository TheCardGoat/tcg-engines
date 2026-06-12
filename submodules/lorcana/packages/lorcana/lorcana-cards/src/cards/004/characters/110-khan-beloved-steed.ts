import type { CharacterCard } from "@tcg/lorcana-types";
import { khanBelovedSteedI18n } from "./110-khan-beloved-steed.i18n";

export const khanBelovedSteed: CharacterCard = {
  id: "CdR",
  canonicalId: "ci_CdR",
  reprints: ["set4-110"],
  cardType: "character",
  name: "Khan",
  version: "Beloved Steed",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "004",
  cardNumber: 110,
  rarity: "uncommon",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_de5bf1478737423d8469d662e40a89d0",
    tcgPlayer: 547780,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: khanBelovedSteedI18n,
};
