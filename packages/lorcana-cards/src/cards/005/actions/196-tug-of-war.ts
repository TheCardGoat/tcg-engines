import type { ActionCard } from "@tcg/lorcana-types";

export const tugofwar: ActionCard = {
  id: "1pu",
  cardType: "action",
  name: "Tug-of-War",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "005",
  text: "Choose one:\n• Deal 1 damage to each opposing character without Evasive.\n• Deal 3 damage to each opposing character with Evasive.",
  cost: 5,
  cardNumber: 196,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "de379a9a8efe4e9448c52cc6876bf5893405ba9c",
  },
  abilities: [
    {
      id: "1pu-2",
      type: "action",
      effect: {
        type: "deal-damage",
        amount: 1,
        target: {
          selector: "all",
          count: "all",
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "• Deal 1 damage to each opposing character without Evasive.",
    },
    {
      id: "1pu-3",
      type: "action",
      effect: {
        type: "deal-damage",
        amount: 3,
        target: {
          selector: "all",
          count: "all",
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "• Deal 3 damage to each opposing character with Evasive.",
    },
  ],
};
