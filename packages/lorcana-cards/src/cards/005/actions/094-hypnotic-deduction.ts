import type { ActionCard } from "@tcg/lorcana-types";

export const hypnoticDeduction: ActionCard = {
  abilities: [
    {
      effect: {
        type: "draw",
        amount: 3,
        target: "CONTROLLER",
      },
      id: "5ug-1",
      text: "Draw 3 cards, then put 2 cards from your hand on the top of your deck in any order.",
      type: "action",
    },
  ],
  cardNumber: 94,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "15120252cebb874fa99bde7fc2f9934b81be20c8",
  },
  franchise: "Great Mouse Detective",
  id: "5ug",
  inkType: ["emerald"],
  inkable: true,
  missingTests: true,
  name: "Hypnotic Deduction",
  set: "005",
  text: "Draw 3 cards, then put 2 cards from your hand on the top of your deck in any order.",
};
