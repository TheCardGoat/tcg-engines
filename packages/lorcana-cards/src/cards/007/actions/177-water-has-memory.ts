import type { ActionCard } from "@tcg/lorcana-types";

export const waterHasMemory: ActionCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            type: "scry",
            amount: 4,
            target: "CHOSEN_PLAYER",
            destinations: [
              {
                zone: "deck-bottom",
                remainder: true,
                ordering: "player-choice",
              },
            ],
          },
          {
            type: "put-on-bottom",
            target: "CHOSEN_CHARACTER",
          },
        ],
        type: "sequence",
      },
      id: "q8v-1",
      text: "Look at the top 4 cards of chosen player's deck. Put one on the top of their deck and the rest on the bottom of their deck in any order.",
      type: "action",
    },
  ],
  cardNumber: 177,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "5e97cf7b8358a2a7fa4446b2bfdf89d0986ab9fe",
  },
  franchise: "Frozen",
  id: "q8v",
  inkType: ["sapphire"],
  inkable: false,
  missingTests: true,
  name: "Water Has Memory",
  set: "007",
  text: "Look at the top 4 cards of chosen player's deck. Put one on the top of their deck and the rest on the bottom of their deck in any order.",
};
