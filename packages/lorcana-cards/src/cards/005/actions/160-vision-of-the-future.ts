import type { ActionCard } from "@tcg/lorcana-types";

export const visionOfTheFuture: ActionCard = {
  id: "xym",
  cardType: "action",
  name: "Vision of the Future",
  inkType: ["sapphire"],
  franchise: "Sword in the Stone",
  set: "005",
  text: "Look at the top 5 cards of your deck. Put one into your hand and the rest on the bottom of your deck in any order.",
  cost: 2,
  cardNumber: 160,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "0366689dbfdf33fe2cb12178345f2f0b38c13555",
  },
  abilities: [
    {
      id: "xym-1",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "scry",
            amount: 5,
            target: "CONTROLLER",
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
      },
      text: "Look at the top 5 cards of your deck. Put one into your hand and the rest on the bottom of your deck in any order.",
    },
  ],
};
