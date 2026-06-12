import type { CharacterCard } from "@tcg/lorcana-types";
import { snowWhiteUnexpectedHouseguestI18n } from "./024-snow-white-unexpected-houseguest.i18n";

export const snowWhiteUnexpectedHouseguest: CharacterCard = {
  id: "BdH",
  canonicalId: "ci_BdH",
  reprints: ["set2-024"],
  cardType: "character",
  name: "Snow White",
  version: "Unexpected Houseguest",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "002",
  cardNumber: 24,
  rarity: "uncommon",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_a40dcfcf0f944762a1b3f31d9a322c9a",
    tcgPlayer: 526378,
  },
  text: [
    {
      title: "HOW DO YOU DO?",
      description: "You pay 1 {I} less to play Seven Dwarfs characters.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      id: "1sk-1",
      name: "HOW DO YOU DO?",
      text: "HOW DO YOU DO? You pay 1 {I} less to play Seven Dwarfs characters.",
      type: "static",
      effect: {
        amount: 1,
        cardType: "character",
        classification: "Seven Dwarfs",
        target: "CONTROLLER",
        type: "cost-reduction",
      },
    },
  ],
  i18n: snowWhiteUnexpectedHouseguestI18n,
};
