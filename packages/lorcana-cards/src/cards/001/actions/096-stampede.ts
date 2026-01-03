import type { ActionCard } from "@tcg/lorcana-types";

export const Stampede: ActionCard = {
  id: "1fs",
  cardType: "action",
  name: "Stampede",
  inkType: ["emerald"],
  franchise: "Lion King",
  set: "001",
  text: "Deal 2 damage to chosen damaged character.",
  cost: 1,
  cardNumber: 96,
  inkable: false,
  externalIds: {
    ravensburger: "b7ee67706e4c50411acea0e129205737bfde9ac9",
  },
  abilities: [
    {
      id: "1fs-1",
      text: "Deal 2 damage to chosen damaged character.",
      type: "action",
      effect: {
        type: "deal-damage",
        amount: 2,
        target: "CHOSEN_CHARACTER",
      },
    },
  ],
};
