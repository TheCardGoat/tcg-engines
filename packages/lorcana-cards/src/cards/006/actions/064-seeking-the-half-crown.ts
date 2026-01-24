import type { ActionCard } from "@tcg/lorcana-types";

export const seekingTheHalfCrown: ActionCard = {
  id: "4qr",
  cardType: "action",
  name: "Seeking the Half Crown",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "006",
  text: "For each Sorcerer character you have in play, you pay 1 {I} less to play this action.\nDraw 2 cards.",
  cost: 5,
  cardNumber: 64,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "111879cd3089326363423d333c1ab2112fc415da",
  },
  abilities: [
    {
      id: "4qr-1",
      type: "action",
      effect: {
        type: "for-each",
        counter: {
          type: "characters",
          controller: "you",
        },
        effect: {
          type: "play-card",
          from: "hand",
        },
      },
      text: "For each Sorcerer character you have in play, you pay 1 {I} less to play this action.",
    },
    {
      id: "4qr-2",
      type: "action",
      effect: {
        type: "draw",
        amount: 2,
        target: "CONTROLLER",
      },
      text: "Draw 2 cards.",
    },
  ],
};
