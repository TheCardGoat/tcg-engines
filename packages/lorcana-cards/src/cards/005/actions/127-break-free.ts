import type { ActionCard } from "@tcg/lorcana-types";

export const breakFree: ActionCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            amount: 1,
            target: {
              cardTypes: ["character"],
              count: 1,
              owner: "any",
              selector: "chosen",
              zones: ["play"],
            },
            type: "deal-damage",
          },
          {
            steps: [
              {
                keyword: "Rush",
                target: "CHOSEN_CHARACTER",
                type: "gain-keyword",
              },
              {
                duration: "this-turn",
                modifier: 1,
                stat: "strength",
                target: "CHOSEN_CHARACTER",
                type: "modify-stat",
              },
            ],
            type: "sequence",
          },
        ],
        type: "sequence",
      },
      id: "10c-1",
      text: "Deal 1 damage to chosen character of yours. They gain Rush and get +1 {S} this turn.",
      type: "action",
    },
  ],
  cardNumber: 127,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "8248c978719b5c75b9b75c52ba7e436f3fc416db",
  },
  franchise: "Peter Pan",
  id: "10c",
  inkType: ["ruby"],
  inkable: true,
  missingTests: true,
  name: "Break Free",
  set: "005",
  text: "Deal 1 damage to chosen character of yours. They gain Rush and get +1 {S} this turn. (They can challenge the turn they're played.)",
};
