import type { CharacterCard } from "@tcg/lorcana-types";

export const brooklynSecondInCommand: CharacterCard = {
  abilities: [
    {
      id: "nda-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        condition: {
          expression: "you have 3 or more cards in your hand",
          type: "if",
        },
        then: {
          restriction: "cant-ready",
          target: "SELF",
          type: "restriction",
        },
        type: "conditional",
      },
      id: "nda-2",
      text: "STONE BY DAY If you have 3 or more cards in your hand, this character can't ready.",
      type: "action",
    },
  ],
  cardNumber: 120,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Gargoyle"],
  cost: 2,
  externalIds: {
    ravensburger: "543925fbb545a12396337e7712d953e7dd0f5651",
  },
  franchise: "Gargoyles",
  fullName: "Brooklyn - Second in Command",
  id: "nda",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Brooklyn",
  set: "010",
  strength: 3,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.",
  version: "Second in Command",
  willpower: 2,
};
