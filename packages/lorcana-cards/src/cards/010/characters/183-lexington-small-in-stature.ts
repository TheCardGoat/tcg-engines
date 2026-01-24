import type { CharacterCard } from "@tcg/lorcana-types";

export const lexingtonSmallInStature: CharacterCard = {
  id: "wbg",
  cardType: "character",
  name: "Lexington",
  version: "Small in Stature",
  fullName: "Lexington - Small in Stature",
  inkType: ["steel"],
  franchise: "Gargoyles",
  set: "010",
  text: "Alert (This character can challenge as if they had Evasive.)\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.",
  cost: 3,
  strength: 4,
  willpower: 4,
  lore: 1,
  cardNumber: 183,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "747a1bda0a4acde5dc18cc41597751d4687ea225",
  },
  abilities: [
    {
      id: "wbg-1",
      type: "keyword",
      keyword: "Alert",
      text: "Alert",
    },
    {
      id: "wbg-2",
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
