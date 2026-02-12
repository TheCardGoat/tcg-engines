import type { ActionCard } from "@tcg/lorcana-types";

export const digALittleDeeper: ActionCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            type: "scry",
            amount: 7,
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
      id: "win-1",
      text: "Sing Together 8 Look at the top 7 cards of your deck. Put 2 into your hand and the rest on the bottom of your deck in any order.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 166,
  cardType: "action",
  cost: 8,
  externalIds: {
    ravensburger: "7532c69617d7ae6a280449248ba2db8345934f92",
  },
  franchise: "Princess and the Frog",
  id: "win",
  inkType: ["sapphire"],
  inkable: false,
  missingTests: true,
  name: "Dig a Little Deeper",
  set: "009",
  text: "Sing Together 8 Look at the top 7 cards of your deck. Put 2 into your hand and the rest on the bottom of your deck in any order.",
};
