import type { ActionCard } from "@tcg/lorcana-types";

export const developYourBrain: ActionCard = {
  abilities: [
    {
      effect: {
        amount: 2,
        destinations: [
          { max: 1, min: 1, zone: "hand" },
          { remainder: true, zone: "deck-bottom" },
        ],
        type: "scry",
      },
      id: "yy9-1",
      text: "Look at the top 2 cards of your deck. Put one into your hand and the other on the bottom of the deck.",
      type: "action",
    },
  ],
  cardNumber: 161,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Develop Your Brain",
  id: "yy9",
  inkType: ["sapphire"],
  inkable: true,
  name: "Develop Your Brain",
  set: "001",
  text: "Look at the top 2 cards of your deck. Put one into your hand and the other on the bottom of the deck.",
  version: "",
};
