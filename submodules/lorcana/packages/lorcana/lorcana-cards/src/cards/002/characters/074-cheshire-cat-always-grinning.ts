import type { CharacterCard } from "@tcg/lorcana-types";
import { cheshireCatAlwaysGrinningI18n } from "./074-cheshire-cat-always-grinning.i18n";

export const cheshireCatAlwaysGrinning: CharacterCard = {
  id: "Eis",
  canonicalId: "ci_Eis",
  reprints: ["set2-074"],
  cardType: "character",
  name: "Cheshire Cat",
  version: "Always Grinning",
  inkType: ["emerald"],
  franchise: "Alice in Wonderland",
  set: "002",
  cardNumber: 74,
  rarity: "uncommon",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_6ba7d8ee8a894df9a67bc08fa0ad9b35",
    tcgPlayer: 527271,
  },
  classifications: ["Storyborn"],
  i18n: cheshireCatAlwaysGrinningI18n,
};
