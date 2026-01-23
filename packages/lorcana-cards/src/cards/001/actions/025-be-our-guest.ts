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
        type: "scry",
        amount: 4,
        destinations: [
          {
            zone: "hand",
            min: 0,
            max: 1,
            filter: { type: "card-type", cardType: "character" },
            reveal: true,
          },
          { zone: "deck-bottom", remainder: true, ordering: "player-choice" },
        ],
      },
    },
  ],
};
