import type { CharacterCard } from "@tcg/lorcana-types";

export const snowWhiteUnexpectedHouseguest: CharacterCard = {
  abilities: [
    {
      effect: {
        from: "hand",
        type: "play-card",
      },
      id: "1sk-1",
      text: "HOW DO YOU DO? You pay 1 {I} less to play Seven Dwarfs characters.",
      type: "action",
    },
  ],
  cardNumber: 24,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess"],
  cost: 2,
  externalIds: {
    ravensburger: "e8b4c6153e06c369d41c32903f772a650246e12c",
  },
  franchise: "Snow White",
  fullName: "Snow White - Unexpected Houseguest",
  id: "1sk",
  inkType: ["amber"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Snow White",
  set: "002",
  strength: 1,
  text: "HOW DO YOU DO? You pay 1 {I} less to play Seven Dwarfs characters.",
  version: "Unexpected Houseguest",
  willpower: 2,
};
