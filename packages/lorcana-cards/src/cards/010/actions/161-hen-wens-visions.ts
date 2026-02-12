import type { ActionCard } from "@tcg/lorcana-types";

export const henWensVisions: ActionCard = {
  abilities: [
    {
      effect: {
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
        type: "sequence",
      },
      id: "reo-1",
      text: "Look at the top 4 cards of your deck. Put 1 on the top of your deck and the rest on the bottom in any order.",
      type: "action",
    },
  ],
  cardNumber: 161,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "62c7d4a3df38c8b6c4725e8b0ba8627fe5604b2d",
  },
  franchise: "Black Cauldron",
  id: "reo",
  inkType: ["sapphire"],
  inkable: true,
  missingTests: true,
  name: "Hen Wen's Visions",
  set: "010",
  text: "Look at the top 4 cards of your deck. Put 1 on the top of your deck and the rest on the bottom in any order.",
};
