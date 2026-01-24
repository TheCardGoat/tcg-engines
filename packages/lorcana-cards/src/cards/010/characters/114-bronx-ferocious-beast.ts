import type { CharacterCard } from "@tcg/lorcana-types";

export const bronxFerociousBeast: CharacterCard = {
  id: "ews",
  cardType: "character",
  name: "Bronx",
  version: "Ferocious Beast",
  fullName: "Bronx - Ferocious Beast",
  inkType: ["ruby"],
  franchise: "Gargoyles",
  set: "010",
  text: "Reckless (This character can't quest and must challenge each turn if able.)\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.",
  cost: 3,
  strength: 6,
  willpower: 4,
  lore: 0,
  cardNumber: 114,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "35bd1b5cebc36f804337eb70b555bf8033e5ada9",
  },
  abilities: [
    {
      id: "ews-1",
      type: "keyword",
      keyword: "Reckless",
      text: "Reckless",
    },
    {
      id: "ews-2",
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
