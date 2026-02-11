import type { ActionCard } from "@tcg/lorcana-types";

export const seekingTheHalfCrown: ActionCard = {
  abilities: [
    {
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
      id: "4qr-1",
      text: "For each Sorcerer character you have in play, you pay 1 {I} less to play this action.",
      type: "action",
    },
    {
      effect: {
        type: "draw",
        amount: 2,
        target: "CONTROLLER",
      },
      id: "4qr-2",
      text: "Draw 2 cards.",
      type: "action",
    },
  ],
  cardNumber: 64,
  cardType: "action",
  cost: 5,
  externalIds: {
    ravensburger: "111879cd3089326363423d333c1ab2112fc415da",
  },
  franchise: "Aladdin",
  id: "4qr",
  inkType: ["amethyst"],
  inkable: false,
  missingTests: true,
  name: "Seeking the Half Crown",
  set: "006",
  text: "For each Sorcerer character you have in play, you pay 1 {I} less to play this action.\nDraw 2 cards.",
};
