import type { ActionCard } from "@tcg/lorcana-types";

export const thievery: ActionCard = {
  abilities: [
    {
      effect: {
        type: "sequence",
        steps: [
          {
            type: "lose-lore",
            amount: 1,
            target: "OPPONENT",
          },
          {
            type: "gain-lore",
            amount: 1,
          },
        ],
      },
      id: "f60-1",
      text: "Chosen opponent loses 1 lore. Gain 1 lore.",
      type: "action",
    },
  ],
  cardNumber: 128,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "36a9657a6b15dfe235ab7840e90fbe036a4aad9b",
  },
  franchise: "Aladdin",
  id: "f60",
  inkType: ["ruby"],
  inkable: true,
  missingTests: true,
  name: "Thievery",
  set: "006",
  text: "Chosen opponent loses 1 lore. Gain 1 lore.",
};
