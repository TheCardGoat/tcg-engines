import type { CharacterCard } from "@tcg/lorcana-types";

export const vinnieGreenPigeon: CharacterCard = {
  abilities: [
    {
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      id: "ogk-1",
      text: "LEARNING EXPERIENCE During an opponent's turn, whenever one of your other characters is banished, gain 1 lore.",
      type: "action",
    },
  ],
  cardNumber: 194,
  cardType: "character",
  classifications: ["Storyborn"],
  cost: 3,
  externalIds: {
    ravensburger: "5827dd1bd5d9fc8a64b9e611432fefae1a0c5449",
  },
  franchise: "Bolt",
  fullName: "Vinnie - Green Pigeon",
  id: "ogk",
  inkType: ["steel"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Vinnie",
  set: "008",
  strength: 1,
  text: "LEARNING EXPERIENCE During an opponent's turn, whenever one of your other characters is banished, gain 1 lore.",
  version: "Green Pigeon",
  willpower: 4,
};
