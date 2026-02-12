import type { CharacterCard } from "@tcg/lorcana-types";

export const orvilleAlbatrossAir: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "SELF",
      },
      id: "1jn-1",
      text: "WELCOME ABOARD, FOLKS During your turn, while you have a character named Miss Bianca or Bernard in play, this character gains Evasive.",
      type: "action",
    },
  ],
  cardNumber: 194,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "c89b02a8c5ef092f289aafd2dc51de65961e2f18",
  },
  franchise: "Rescuers",
  fullName: "Orville - Albatross Air",
  id: "1jn",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Orville",
  set: "007",
  strength: 4,
  text: "WELCOME ABOARD, FOLKS During your turn, while you have a character named Miss Bianca or Bernard in play, this character gains Evasive. (They can challenge characters with Evasive.)",
  version: "Albatross Air",
  willpower: 3,
};
