import type { ActionCard } from "@tcg/lorcana-types";

export const timeToGo: ActionCard = {
  abilities: [
    {
      effect: {
        condition: {
          expression: "that character had a card under them",
          type: "if",
        },
        then: {
          amount: 3,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "conditional",
      },
      id: "cfj-1",
      text: "Banish chosen character of yours to draw 2 cards. If that character had a card under them, draw 3 cards instead.",
      type: "action",
    },
  ],
  cardNumber: 131,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "2ccdbaf5525fefc69a486d32fa6a3e8fd923d02f",
  },
  franchise: "Beauty and the Beast",
  id: "cfj",
  inkType: ["ruby"],
  inkable: true,
  missingTests: true,
  name: "Time to Go!",
  set: "010",
  text: "Banish chosen character of yours to draw 2 cards. If that character had a card under them, draw 3 cards instead.",
};
