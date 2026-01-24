import type { CharacterCard } from "@tcg/lorcana-types";

export const brooklynSecondInCommand: CharacterCard = {
  id: "nda",
  cardType: "character",
  name: "Brooklyn",
  version: "Second in Command",
  fullName: "Brooklyn - Second in Command",
  inkType: ["ruby"],
  franchise: "Gargoyles",
  set: "010",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  cardNumber: 120,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "543925fbb545a12396337e7712d953e7dd0f5651",
  },
  abilities: [
    {
      id: "nda-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "nda-2",
      type: "action",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have 3 or more cards in your hand",
        },
        then: {
          type: "restriction",
          restriction: "cant-ready",
          target: "SELF",
        },
      },
      text: "STONE BY DAY If you have 3 or more cards in your hand, this character can't ready.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Gargoyle"],
};
