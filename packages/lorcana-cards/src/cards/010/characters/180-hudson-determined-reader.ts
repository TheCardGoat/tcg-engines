import type { CharacterCard } from "@tcg/lorcana-types";

export const hudsonDeterminedReader: CharacterCard = {
  id: "g6l",
  cardType: "character",
  name: "Hudson",
  version: "Determined Reader",
  fullName: "Hudson - Determined Reader",
  inkType: ["steel"],
  franchise: "Gargoyles",
  set: "010",
  text: "FINDING ANSWERS When you play this character, you may draw a card, then choose and discard a card.\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.",
  cost: 2,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 180,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3a532ccc31353dbb6467164ade2c99d0e31aed29",
  },
  abilities: [
    {
      id: "g6l-1",
      type: "triggered",
      name: "FINDING ANSWERS",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
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
      text: "FINDING ANSWERS When you play this character, you may draw a card, then choose and discard a card.",
    },
    {
      id: "g6l-2",
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
  classifications: ["Storyborn", "Mentor", "Gargoyle"],
};
