import type { CharacterCard } from "@tcg/lorcana-types";

export const donaldDuckNotAgain: CharacterCard = {
  abilities: [
    {
      id: "1mm-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1mm-2",
      text: "PHOOEY! This character gets +1 {L} for each 1 damage on him.",
      type: "static",
    },
  ],
  cardNumber: 106,
  cardType: "character",
  classifications: ["Dreamborn", "Hero"],
  cost: 5,
  externalIds: {
    ravensburger: "d130a56e0f8c8813f9fae0f025c3b78620f2fc45",
  },
  fullName: "Donald Duck - Not Again!",
  id: "1mm",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Donald Duck",
  set: "002",
  strength: 1,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nPHOOEY! This character gets +1 {L} for each 1 damage on him.",
  version: "Not Again!",
  willpower: 5,
};
