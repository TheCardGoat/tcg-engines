import type { CharacterCard } from "@tcg/lorcana-types";

export const snowWhiteUnexpectedHouseguest: CharacterCard = {
  id: "1sk",
  cardType: "character",
  name: "Snow White",
  version: "Unexpected Houseguest",
  fullName: "Snow White - Unexpected Houseguest",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "002",
  text: "HOW DO YOU DO? You pay 1 {I} less to play Seven Dwarfs characters.",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 24,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "e8b4c6153e06c369d41c32903f772a650246e12c",
  },
  abilities: [
    {
      id: "1sk-1",
      type: "action",
      effect: {
        type: "play-card",
        from: "hand",
      },
      text: "HOW DO YOU DO? You pay 1 {I} less to play Seven Dwarfs characters.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};
