import type { ActionCard } from "@tcg/lorcana-types";

export const beOurGuest: ActionCard = {
  abilities: [
    {
      effect: {
        type: "look-at-cards",
        amount: 4,
        source: "deck",
        target: "CONTROLLER",
      },
      id: "wnp-1",
      name: "Be Our Guest",
      text: "Look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 31,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "75b3d826dbb7634142ce2c3a3fe0bab654ec37d0",
  },
  franchise: "Beauty and the Beast",
  id: "wnp",
  inkType: ["amber"],
  inkable: true,
  name: "Be Our Guest",
  set: "009",
  text: "Look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
};
