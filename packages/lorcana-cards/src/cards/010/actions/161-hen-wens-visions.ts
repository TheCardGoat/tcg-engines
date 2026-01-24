import type { ActionCard } from "@tcg/lorcana-types";

export const henWensVisions: ActionCard = {
  id: "reo",
  cardType: "action",
  name: "Hen Wen's Visions",
  inkType: ["sapphire"],
  franchise: "Black Cauldron",
  set: "010",
  text: "Look at the top 4 cards of your deck. Put 1 on the top of your deck and the rest on the bottom in any order.",
  cost: 1,
  cardNumber: 161,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "62c7d4a3df38c8b6c4725e8b0ba8627fe5604b2d",
  },
  abilities: [
    {
      id: "reo-1",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "scry",
            amount: 4,
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
      text: "Look at the top 4 cards of your deck. Put 1 on the top of your deck and the rest on the bottom in any order.",
    },
  ],
};
