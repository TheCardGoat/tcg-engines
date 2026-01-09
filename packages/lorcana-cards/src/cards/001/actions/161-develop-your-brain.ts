import type { ActionCard } from "@tcg/lorcana-types";

export const developYourBrain: ActionCard = {
  id: "yy9",
  cardType: "action",
  name: "Develop Your Brain",
  version: "",
  fullName: "Develop Your Brain",
  inkType: ["sapphire"],
  franchise: "Disney",
  set: "001",
  text: "Look at the top 2 cards of your deck. Put one into your hand and the other on the bottom of the deck.",
  cost: 1,
  cardNumber: 161,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "Look at the top 2 cards of your deck. Put one into your hand and the other on the bottom of the deck.",
      id: "yy9-1",
      effect: {
        type: "scry",
        amount: 2,
        destinations: [
          { zone: "hand", min: 1, max: 1 },
          { zone: "deck-bottom", remainder: true },
        ],
      },
    },
  ],
};
