import type { ActionCard } from "@tcg/lorcana-types";

export const imStillHere: ActionCard = {
  id: "7tt",
  cardType: "action",
  name: "I'm Still Here",
  inkType: ["steel"],
  franchise: "Treasure Planet",
  set: "006",
  text: "Chosen character gains Resist +2 until the start of your next turn. Draw a card. (Damage dealt to them is reduced by 2.)",
  actionSubtype: "song",
  cost: 3,
  cardNumber: 196,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1c3668b9f7832219a19073b3d34479279d7ea3bc",
  },
  abilities: [
    {
      id: "7tt-1",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "gain-keyword",
            keyword: "Resist",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            value: 2,
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
      text: "Chosen character gains Resist +2 until the start of your next turn. Draw a card.",
    },
  ],
};
