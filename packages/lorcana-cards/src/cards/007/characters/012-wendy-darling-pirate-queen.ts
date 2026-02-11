import type { CharacterCard } from "@tcg/lorcana-types";

export const wendyDarlingPirateQueen: CharacterCard = {
  abilities: [
    {
      id: "1oj-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
  ],
  cardNumber: 12,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Queen", "Pirate", "Captain"],
  cost: 7,
  externalIds: {
    ravensburger: "da2e6704efe9fa9440082d5430d64696d469d7e2",
  },
  franchise: "Peter Pan",
  fullName: "Wendy Darling - Pirate Queen",
  id: "1oj",
  inkType: ["amber", "ruby"],
  inkable: true,
  lore: 2,
  missingImplementation: true,
  missingTests: true,
  name: "Wendy Darling",
  set: "007",
  strength: 5,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nTELL NO TALES Whenever one of your other characters is banished, you may remove all damage from chosen character.",
  version: "Pirate Queen",
  willpower: 7,
};
