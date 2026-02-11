import type { CharacterCard } from "@tcg/lorcana-types";

export const hudsonDeterminedReader: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "optional",
        effect: {
          type: "discard",
          amount: 1,
          target: "CONTROLLER",
          chosen: true,
        },
        chooser: "CONTROLLER",
      },
      id: "g6l-1",
      name: "FINDING ANSWERS",
      text: "FINDING ANSWERS When you play this character, you may draw a card, then choose and discard a card.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
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
      id: "g6l-2",
      text: "STONE BY DAY If you have 3 or more cards in your hand, this character can't ready.",
      type: "action",
    },
  ],
  cardNumber: 180,
  cardType: "character",
  classifications: ["Storyborn", "Mentor", "Gargoyle"],
  cost: 2,
  externalIds: {
    ravensburger: "3a532ccc31353dbb6467164ade2c99d0e31aed29",
  },
  franchise: "Gargoyles",
  fullName: "Hudson - Determined Reader",
  id: "g6l",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Hudson",
  set: "010",
  strength: 2,
  text: "FINDING ANSWERS When you play this character, you may draw a card, then choose and discard a card.\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.",
  version: "Determined Reader",
  willpower: 4,
};
