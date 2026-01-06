import type { ActionCard } from "@tcg/lorcana-types/cards/card-types";

export const developYourBrain: ActionCard = {
  id: "yy9",
  cardType: "action",
  name: "Develop Your Brain",
  version: "",
  fullName: "Develop Your Brain",
  inkType: [
    "sapphire",
  ],
  franchise: "General",
  set: "001",
  text: "Look at the top 2 cards of your deck. Put one into your hand and the other on the bottom of the deck.",
  cost: 1,
  cardNumber: 161,
  inkable: true,
  rarity: "common",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 493478,
  },
  abilities: [
    {
      type: "action",
      effect: {
          type: "look-at-cards",
          amount: 2,
          from: "top-of-deck",
          target: "CONTROLLER",
          then: {
            action: "put-on-bottom",
          },
        },
      id: "yy9-1",
      text: "Look at the top 2 cards of your deck. Put one into your hand and the other on the bottom of the deck.",
    },
  ],
};
