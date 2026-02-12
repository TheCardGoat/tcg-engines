import type { ActionCard } from "@tcg/lorcana-types";

export const heHurledHisThunderbolt: ActionCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            amount: 4,
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
            duration: "this-turn",
            keyword: "Challenger",
            target: "YOUR_CHARACTERS",
            type: "gain-keyword",
            value: 2,
          },
        ],
        type: "sequence",
      },
      id: "h6t-1",
      text: "Deal 4 damage to chosen character. Your Deity characters gain Challenger +2 this turn.",
      type: "static",
    },
  ],
  actionSubtype: "song",
  cardNumber: 197,
  cardType: "action",
  cost: 4,
  externalIds: {
    ravensburger: "3df3672475d3e1613abd59e34cc44da9380373b9",
  },
  franchise: "Hercules",
  id: "h6t",
  inkType: ["steel"],
  inkable: false,
  missingTests: true,
  name: "He Hurled His Thunderbolt",
  set: "010",
  text: "Deal 4 damage to chosen character. Your Deity characters gain Challenger +2 this turn. (They get +2 {S} while challenging.)",
};
