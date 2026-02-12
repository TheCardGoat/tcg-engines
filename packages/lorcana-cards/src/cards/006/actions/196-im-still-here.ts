import type { ActionCard } from "@tcg/lorcana-types";

export const imStillHere: ActionCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            keyword: "Resist",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "gain-keyword",
            value: 2,
          },
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
        ],
        type: "sequence",
      },
      id: "7tt-1",
      text: "Chosen character gains Resist +2 until the start of your next turn. Draw a card.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 196,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "1c3668b9f7832219a19073b3d34479279d7ea3bc",
  },
  franchise: "Treasure Planet",
  id: "7tt",
  inkType: ["steel"],
  inkable: true,
  missingTests: true,
  name: "I'm Still Here",
  set: "006",
  text: "Chosen character gains Resist +2 until the start of your next turn. Draw a card. (Damage dealt to them is reduced by 2.)",
};
