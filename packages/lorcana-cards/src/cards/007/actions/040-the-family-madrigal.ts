import type { ActionCard } from "@tcg/lorcana-types";

export const theFamilyMadrigal: ActionCard = {
  id: "ibc",
  cardType: "action",
  name: "The Family Madrigal",
  inkType: ["amber", "amethyst"],
  franchise: "Encanto",
  set: "007",
  text: "Look at the top 5 cards of your deck. You may reveal up to 1 Madrigal character card and up to 1 song card and put them into your hand. Put the rest on the top of your deck in any order.",
  actionSubtype: "song",
  cost: 5,
  cardNumber: 40,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "420231f6bb1e6544dc1575a7d7d4334232698cfb",
  },
  abilities: [
    {
      id: "ibc-1",
      type: "action",
      effect: {
        type: "scry",
        amount: 5,
        target: "CONTROLLER",
        destinations: [
          {
            zone: "hand",
            min: 0,
            max: 1,
            reveal: true,
          },
          {
            zone: "hand",
            min: 0,
            max: 1,
            filter: {
              type: "song",
            },
            reveal: true,
          },
          {
            zone: "deck-top",
            remainder: true,
            ordering: "player-choice",
          },
        ],
      },
      text: "Look at the top 5 cards of your deck. You may reveal up to 1 Madrigal character card and up to 1 song card and put them into your hand. Put the rest on the top of your deck in any order.",
    },
  ],
};
