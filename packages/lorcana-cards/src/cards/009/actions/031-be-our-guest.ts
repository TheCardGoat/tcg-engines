import type { ActionCard } from "@tcg/lorcana-types";

export const beOurGuest: ActionCard = {
  id: "wnp",
  cardType: "action",
  name: "Be Our Guest",
  inkType: ["amber"],
  franchise: "Beauty and the Beast",
  set: "009",
  text: "Look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
  actionSubtype: "song",
  cost: 2,
  cardNumber: 31,
  inkable: true,
  externalIds: {
    ravensburger: "75b3d826dbb7634142ce2c3a3fe0bab654ec37d0",
  },
  abilities: [
    {
      id: "wnp-1",
      text: "Look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      name: "Be Our Guest",
      type: "action",
      effect: {
        type: "look-at-cards",
        amount: 4,
        source: "deck",
        target: "CONTROLLER",
      },
    },
  ],
};
