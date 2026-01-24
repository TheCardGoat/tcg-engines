import type { ActionCard } from "@tcg/lorcana-types";

export const hypnoticDeduction: ActionCard = {
  id: "5ug",
  cardType: "action",
  name: "Hypnotic Deduction",
  inkType: ["emerald"],
  franchise: "Great Mouse Detective",
  set: "005",
  text: "Draw 3 cards, then put 2 cards from your hand on the top of your deck in any order.",
  cost: 2,
  cardNumber: 94,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "15120252cebb874fa99bde7fc2f9934b81be20c8",
  },
  abilities: [
    {
      id: "5ug-1",
      type: "action",
      effect: {
        type: "draw",
        amount: 3,
        target: "CONTROLLER",
      },
      text: "Draw 3 cards, then put 2 cards from your hand on the top of your deck in any order.",
    },
  ],
};
