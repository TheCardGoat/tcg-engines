import type { CharacterCard } from "@tcg/lorcana-types";

export const lexingtonSmallInStature: CharacterCard = {
  abilities: [
    {
      id: "wbg-1",
      keyword: "Alert",
      text: "Alert",
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
      id: "wbg-2",
      text: "STONE BY DAY If you have 3 or more cards in your hand, this character can't ready.",
      type: "action",
    },
  ],
  cardNumber: 183,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Gargoyle"],
  cost: 3,
  externalIds: {
    ravensburger: "747a1bda0a4acde5dc18cc41597751d4687ea225",
  },
  franchise: "Gargoyles",
  fullName: "Lexington - Small in Stature",
  id: "wbg",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Lexington",
  set: "010",
  strength: 4,
  text: "Alert (This character can challenge as if they had Evasive.)\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.",
  version: "Small in Stature",
  willpower: 4,
};
