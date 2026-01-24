import type { ItemCard } from "@tcg/lorcana-types";

export const chemPurse: ItemCard = {
  id: "1ea",
  cardType: "item",
  name: "Chem Purse",
  inkType: ["emerald"],
  franchise: "Big Hero 6",
  set: "008",
  text: "HERE'S THE BEST PART Whenever you play a character, if you used Shift to play them, they get +4 {S} this turn.",
  cost: 2,
  cardNumber: 119,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b53e4e6943d5cde0bb2744696e3434d34149f381",
  },
  abilities: [
    {
      id: "1ea-1",
      type: "triggered",
      name: "HERE'S THE BEST PART",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "character",
        },
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you used Shift to play them",
        },
        then: {
          type: "modify-stat",
          stat: "strength",
          modifier: 4,
          target: "CHOSEN_CHARACTER",
          duration: "this-turn",
        },
      },
      text: "HERE'S THE BEST PART Whenever you play a character, if you used Shift to play them, they get +4 {S} this turn.",
    },
  ],
};
