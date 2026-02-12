import type { ActionCard } from "@tcg/lorcana-types";

export const beOurGuest: ActionCard = {
  abilities: [
    {
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
