import type { CharacterCard } from "@tcg/lorcana-types";

export const captainAmeliaFirstInCommand: CharacterCard = {
  abilities: [
    {
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "1xb-1",
      text: "DISCIPLINE During your turn, this character gains Evasive.",
      type: "action",
    },
  ],
  cardNumber: 138,
  cardType: "character",
  classifications: ["Storyborn", "Alien", "Captain"],
  cost: 3,
  externalIds: {
    ravensburger: "06f07cce4b8529674c6da0f1709720cf364f1e60",
  },
  franchise: "Treasure Planet",
  fullName: "Captain Amelia - First in Command",
  id: "1xb",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Captain Amelia",
  set: "003",
  strength: 1,
  text: "DISCIPLINE During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  version: "First in Command",
  willpower: 5,
};
