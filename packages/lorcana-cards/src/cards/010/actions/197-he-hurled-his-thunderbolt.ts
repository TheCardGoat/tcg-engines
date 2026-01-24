import type { ActionCard } from "@tcg/lorcana-types";

export const heHurledHisThunderbolt: ActionCard = {
  id: "h6t",
  cardType: "action",
  name: "He Hurled His Thunderbolt",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "010",
  text: "Deal 4 damage to chosen character. Your Deity characters gain Challenger +2 this turn. (They get +2 {S} while challenging.)",
  actionSubtype: "song",
  cost: 4,
  cardNumber: 197,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "3df3672475d3e1613abd59e34cc44da9380373b9",
  },
  abilities: [
    {
      id: "h6t-1",
      type: "static",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "deal-damage",
            amount: 4,
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "gain-keyword",
            keyword: "Challenger",
            target: "YOUR_CHARACTERS",
            value: 2,
            duration: "this-turn",
          },
        ],
      },
      text: "Deal 4 damage to chosen character. Your Deity characters gain Challenger +2 this turn.",
    },
  ],
};
