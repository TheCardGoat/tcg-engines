import type { ActionCard } from "@tcg/lorcana-types";

export const theFamilyMadrigal: ActionCard = {
  abilities: [
    {
      effect: {
        amount: 5,
        destinations: [
          {
            max: 1,
            min: 0,
            reveal: true,
            zone: "hand",
          },
          {
            filter: {
              type: "song",
            },
            max: 1,
            min: 0,
            reveal: true,
            zone: "hand",
          },
          {
            ordering: "player-choice",
            remainder: true,
            zone: "deck-top",
          },
        ],
        target: "CONTROLLER",
        type: "scry",
      },
      id: "ibc-1",
      text: "Look at the top 5 cards of your deck. You may reveal up to 1 Madrigal character card and up to 1 song card and put them into your hand. Put the rest on the top of your deck in any order.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 40,
  cardType: "action",
  cost: 5,
  externalIds: {
    ravensburger: "420231f6bb1e6544dc1575a7d7d4334232698cfb",
  },
  franchise: "Encanto",
  id: "ibc",
  inkType: ["amber", "amethyst"],
  inkable: true,
  missingTests: true,
  name: "The Family Madrigal",
  set: "007",
  text: "Look at the top 5 cards of your deck. You may reveal up to 1 Madrigal character card and up to 1 song card and put them into your hand. Put the rest on the top of your deck in any order.",
};
