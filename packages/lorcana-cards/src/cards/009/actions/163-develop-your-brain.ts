import type { ActionCard } from "@tcg/lorcana-types";

export const developYourBrain: ActionCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            type: "scry",
            amount: 2,
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
        type: "sequence",
      },
      id: "z3c-1",
      text: "Look at the top 2 cards of your deck. Put one into your hand and the other on the bottom of your deck.",
      type: "action",
    },
  ],
  cardNumber: 163,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "7e7a5204a324e3773bc06deedaedb33fe5803b64",
  },
  franchise: "Sword in the Stone",
  id: "z3c",
  inkType: ["sapphire"],
  inkable: true,
  missingTests: true,
  name: "Develop Your Brain",
  set: "009",
  text: "Look at the top 2 cards of your deck. Put one into your hand and the other on the bottom of your deck.",
};
