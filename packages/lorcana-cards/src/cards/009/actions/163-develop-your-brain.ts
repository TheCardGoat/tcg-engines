import type { ActionCard } from "@tcg/lorcana-types";

export const developYourBrain: ActionCard = {
  id: "z3c",
  cardType: "action",
  name: "Develop Your Brain",
  inkType: ["sapphire"],
  franchise: "Sword in the Stone",
  set: "009",
  text: "Look at the top 2 cards of your deck. Put one into your hand and the other on the bottom of your deck.",
  cost: 1,
  cardNumber: 163,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7e7a5204a324e3773bc06deedaedb33fe5803b64",
  },
  abilities: [
    {
      id: "z3c-1",
      type: "action",
      effect: {
        type: "sequence",
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
      },
      text: "Look at the top 2 cards of your deck. Put one into your hand and the other on the bottom of your deck.",
    },
  ],
};
