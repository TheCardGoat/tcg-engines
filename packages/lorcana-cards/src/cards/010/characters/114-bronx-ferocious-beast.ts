import type { CharacterCard } from "@tcg/lorcana-types";

export const bronxFerociousBeast: CharacterCard = {
  abilities: [
    {
      id: "ews-1",
      keyword: "Reckless",
      text: "Reckless",
      type: "keyword",
    },
    {
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
      id: "ews-2",
      text: "STONE BY DAY If you have 3 or more cards in your hand, this character can't ready.",
      type: "action",
    },
  ],
  cardNumber: 114,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Gargoyle"],
  cost: 3,
  externalIds: {
    ravensburger: "35bd1b5cebc36f804337eb70b555bf8033e5ada9",
  },
  franchise: "Gargoyles",
  fullName: "Bronx - Ferocious Beast",
  id: "ews",
  inkType: ["ruby"],
  inkable: true,
  lore: 0,
  missingTests: true,
  name: "Bronx",
  set: "010",
  strength: 6,
  text: "Reckless (This character can't quest and must challenge each turn if able.)\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.",
  version: "Ferocious Beast",
  willpower: 4,
};
