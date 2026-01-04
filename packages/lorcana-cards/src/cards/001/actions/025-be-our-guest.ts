import type { ActionCard } from "@tcg/lorcana-types";

export const beOurGuest: ActionCard = {
  id: "25a",
  cardType: "action",
  name: "Be Our Guest",
  inkType: ["amber"],
  franchise: "Beauty and the Beast",
  set: "001",
  text: "Look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
  actionSubtype: "song",
  cost: 2,
  cardNumber: 25,
  inkable: true,
  externalIds: {
    ravensburger: "25a", // Placeholder
  },
  abilities: [
    {
      id: "25a-1",
      text: "Look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      type: "action",
      effect: {
        type: "look-at-cards",
        amount: 4,
        from: "top-of-deck",
        target: "CONTROLLER",
        then: {
          action: "put-in-hand",
          filter: { type: "card-type", cardType: "character" },
        },
      },
    },
  ],
};
