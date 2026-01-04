import type { ActionCard } from "@tcg/lorcana-types";

export const developYourBrainundefined: ActionCard = {
  id: "yy9",
  cardType: "action",
  name: "Develop Your Brain",
  version: "undefined",
  fullName: "Develop Your Brain - undefined",
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
        type: "sequence",
        steps: [
          {
            type: "look-at-cards",
            amount: 2,
            from: "top-of-deck",
            target: "CONTROLLER",
          },
          {
            type: "put-on-bottom",
            target: "CHOSEN_CHARACTER",
          },
        ],
      },
    },
  ],
};
