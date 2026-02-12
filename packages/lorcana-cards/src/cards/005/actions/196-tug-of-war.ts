import type { ActionCard } from "@tcg/lorcana-types";

export const tugofwar: ActionCard = {
  abilities: [
    {
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
      id: "1pu-2",
      text: "• Deal 1 damage to each opposing character without Evasive.",
      type: "action",
    },
    {
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
      id: "1pu-3",
      text: "• Deal 3 damage to each opposing character with Evasive.",
      type: "action",
    },
  ],
  cardNumber: 196,
  cardType: "action",
  cost: 5,
  externalIds: {
    ravensburger: "de379a9a8efe4e9448c52cc6876bf5893405ba9c",
  },
  franchise: "Peter Pan",
  id: "1pu",
  inkType: ["steel"],
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  name: "Tug-of-War",
  set: "005",
  text: "Choose one:\n• Deal 1 damage to each opposing character without Evasive.\n• Deal 3 damage to each opposing character with Evasive.",
};
