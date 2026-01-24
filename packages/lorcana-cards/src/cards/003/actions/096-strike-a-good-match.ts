import type { ActionCard } from "@tcg/lorcana-types";

export const strikeAGoodMatch: ActionCard = {
  id: "1ru",
  cardType: "action",
  name: "Strike a Good Match",
  inkType: ["emerald"],
  franchise: "Mulan",
  set: "003",
  text: "Draw 2 cards, then choose and discard a card.",
  actionSubtype: "song",
  cost: 2,
  cardNumber: 96,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e41d63dec20f63664cf1d0fa42b721e0f7d72447",
  },
  abilities: [
    {
      id: "1ru-1",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            amount: 2,
            target: "CONTROLLER",
          },
          {
            type: "discard",
            amount: 1,
            target: "CONTROLLER",
            chosen: true,
          },
        ],
      },
      text: "Draw 2 cards, then choose and discard a card.",
    },
  ],
};
