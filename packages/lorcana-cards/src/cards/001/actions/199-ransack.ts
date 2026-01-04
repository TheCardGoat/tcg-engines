import type { ActionCard } from "@tcg/lorcana-types";

export const ransack: ActionCard = {
  id: "1ux",
  cardType: "action",
  name: "Ransack",
  inkType: ["steel"],
  franchise: "Emperors New Groove",
  set: "001",
  text: "Draw 2 cards, then choose and discard 2 cards.",
  cost: 2,
  cardNumber: 199,
  inkable: true,
  externalIds: {
    ravensburger: "f13778c7e4f55190ce7ec9958fcbfbbd0879d0e0",
  },
  abilities: [
    {
      id: "1ux-1",
      text: "Draw 2 cards, then choose and discard 2 cards.",
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
            amount: 2,
            target: "CONTROLLER",
            chosen: true,
          },
        ],
      },
    },
  ],
};
