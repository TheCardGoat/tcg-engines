import type { CharacterCard } from "@tcg/lorcana-types";

export const donaldDuckNotAgain: CharacterCard = {
  id: "1mm",
  cardType: "character",
  name: "Donald Duck",
  version: "Not Again!",
  fullName: "Donald Duck - Not Again!",
  inkType: ["ruby"],
  set: "002",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nPHOOEY! This character gets +1 {L} for each 1 damage on him.",
  cost: 5,
  strength: 1,
  willpower: 5,
  lore: 1,
  cardNumber: 106,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d130a56e0f8c8813f9fae0f025c3b78620f2fc45",
  },
  abilities: [
    {
      id: "1mm-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "1mm-2",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "SELF",
      },
      text: "PHOOEY! This character gets +1 {L} for each 1 damage on him.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
};
