import type { CharacterCard } from "@tcg/lorcana";

export const queenOfHeartsImpulsiveRuler: CharacterCard = {
  id: "106",
  cardType: "character",
  name: "Queen of Hearts",
  version: "Impulsive Ruler",
  fullName: "Queen of Hearts - Impulsive Ruler",
  inkType: ["ruby"],
  franchise: "Alice in Wonderland",
  set: "009",
  text: "Rush (This character can challenge the turn they're played.)",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 123,
  inkable: true,
  externalIds: {
    ravensburger: "8260dc617e55b1bdf94da0f0bf4b25bf196d0848",
  },
  abilities: [
    {
      id: "106-1",
      text: "Rush",
      type: "keyword",
      keyword: "Rush",
    },
  ],
  classifications: ["Storyborn", "Villain", "Queen"],
};
