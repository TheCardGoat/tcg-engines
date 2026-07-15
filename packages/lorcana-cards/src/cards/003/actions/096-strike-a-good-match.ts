import type { ActionCard } from "@tcg/lorcana-types";

export const strikeAGoodMatch: ActionCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            amount: 2,
            target: "CONTROLLER",
            type: "draw",
          },
          {
            amount: 1,
            chosen: true,
            target: "CONTROLLER",
            type: "discard",
          },
        ],
        type: "sequence",
      },
      id: "1ru-1",
      text: "Draw 2 cards, then choose and discard a card.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 96,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "e41d63dec20f63664cf1d0fa42b721e0f7d72447",
  },
  franchise: "Mulan",
  id: "1ru",
  inkType: ["emerald"],
  inkable: true,
  missingTests: true,
  name: "Strike a Good Match",
  set: "003",
  text: "Draw 2 cards, then choose and discard a card.",
};
