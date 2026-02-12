import type { ActionCard } from "@tcg/lorcana-types";

export const beOurGuest: ActionCard = {
  abilities: [
    {
      effect: {
        amount: 4,
        destinations: [
          {
            filter: { type: "card-type", cardType: "character" },
            max: 1,
            min: 0,
            reveal: true,
            zone: "hand",
          },
          { ordering: "player-choice", remainder: true, zone: "deck-bottom" },
        ],
        type: "scry",
      },
      id: "25a-1",
      text: "Look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 25,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "25a", // Placeholder
  },
  franchise: "Beauty and the Beast",
  id: "25a",
  inkType: ["amber"],
  inkable: true,
  name: "Be Our Guest",
  set: "001",
  text: "Look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
};
