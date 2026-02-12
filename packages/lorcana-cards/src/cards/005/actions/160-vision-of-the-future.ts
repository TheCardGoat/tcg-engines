import type { ActionCard } from "@tcg/lorcana-types";

export const visionOfTheFuture: ActionCard = {
  abilities: [
    {
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
      id: "xym-1",
      text: "Look at the top 5 cards of your deck. Put one into your hand and the rest on the bottom of your deck in any order.",
      type: "action",
    },
  ],
  cardNumber: 160,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "0366689dbfdf33fe2cb12178345f2f0b38c13555",
  },
  franchise: "Sword in the Stone",
  id: "xym",
  inkType: ["sapphire"],
  inkable: true,
  missingTests: true,
  name: "Vision of the Future",
  set: "005",
  text: "Look at the top 5 cards of your deck. Put one into your hand and the rest on the bottom of your deck in any order.",
};
