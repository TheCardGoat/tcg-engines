import type { ActionCard } from "@tcg/lorcana-types";

export const thievery: ActionCard = {
  id: "f60",
  cardType: "action",
  name: "Thievery",
  inkType: ["ruby"],
  franchise: "Aladdin",
  set: "006",
  text: "Chosen opponent loses 1 lore. Gain 1 lore.",
  cost: 1,
  cardNumber: 128,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "36a9657a6b15dfe235ab7840e90fbe036a4aad9b",
  },
  abilities: [
    {
      id: "f60-1",
      type: "action",
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
      text: "Chosen opponent loses 1 lore. Gain 1 lore.",
    },
  ],
};
