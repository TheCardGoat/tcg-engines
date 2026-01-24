import type { CharacterCard } from "@tcg/lorcana-types";

export const vinnieGreenPigeon: CharacterCard = {
  id: "ogk",
  cardType: "character",
  name: "Vinnie",
  version: "Green Pigeon",
  fullName: "Vinnie - Green Pigeon",
  inkType: ["steel"],
  franchise: "Bolt",
  set: "008",
  text: "LEARNING EXPERIENCE During an opponent's turn, whenever one of your other characters is banished, gain 1 lore.",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 1,
  cardNumber: 194,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "5827dd1bd5d9fc8a64b9e611432fefae1a0c5449",
  },
  abilities: [
    {
      id: "ogk-1",
      type: "action",
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      text: "LEARNING EXPERIENCE During an opponent's turn, whenever one of your other characters is banished, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn"],
};
