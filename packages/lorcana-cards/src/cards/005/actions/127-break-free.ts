import type { ActionCard } from "@tcg/lorcana-types";

export const breakFree: ActionCard = {
  id: "10c",
  cardType: "action",
  name: "Break Free",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "005",
  text: "Deal 1 damage to chosen character of yours. They gain Rush and get +1 {S} this turn. (They can challenge the turn they're played.)",
  cost: 1,
  cardNumber: 127,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8248c978719b5c75b9b75c52ba7e436f3fc416db",
  },
  abilities: [
    {
      id: "10c-1",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "deal-damage",
            amount: 1,
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "sequence",
            steps: [
              {
                type: "gain-keyword",
                keyword: "Rush",
                target: "CHOSEN_CHARACTER",
              },
              {
                type: "modify-stat",
                stat: "strength",
                modifier: 1,
                target: "CHOSEN_CHARACTER",
                duration: "this-turn",
              },
            ],
          },
        ],
      },
      text: "Deal 1 damage to chosen character of yours. They gain Rush and get +1 {S} this turn.",
    },
  ],
};
