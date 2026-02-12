import type { ItemCard } from "@tcg/lorcana-types";

export const chemPurse: ItemCard = {
  abilities: [
    {
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
      id: "1ea-1",
      name: "HERE'S THE BEST PART",
      text: "HERE'S THE BEST PART Whenever you play a character, if you used Shift to play them, they get +4 {S} this turn.",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "character",
        },
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
