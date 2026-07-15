import type { ItemCard } from "@tcg/lorcana-types";

export const chemPurse: ItemCard = {
  abilities: [
    {
      effect: {
        condition: {
          expression: "you used Shift to play them",
          type: "if",
        },
        then: {
          duration: "this-turn",
          modifier: 4,
          stat: "strength",
          target: "CHOSEN_CHARACTER",
          type: "modify-stat",
        },
        type: "conditional",
      },
      id: "1ea-1",
      name: "HERE'S THE BEST PART",
      text: "HERE'S THE BEST PART Whenever you play a character, if you used Shift to play them, they get +4 {S} this turn.",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 119,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "b53e4e6943d5cde0bb2744696e3434d34149f381",
  },
  franchise: "Big Hero 6",
  id: "1ea",
  inkType: ["emerald"],
  inkable: true,
  missingTests: true,
  name: "Chem Purse",
  set: "008",
  text: "HERE'S THE BEST PART Whenever you play a character, if you used Shift to play them, they get +4 {S} this turn.",
};
