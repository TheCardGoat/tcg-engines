import type { ActionCard } from "@tcg/lorcana-types";

export const ursulasTrickery: ActionCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            amount: 1,
            chosen: true,
            target: "EACH_OPPONENT",
            type: "discard",
          },
          {
            amount: 1,
            target: "EACH_OPPONENT",
            type: "draw",
          },
        ],
        type: "sequence",
      },
      id: "1sb-1",
      text: "Each opponent may choose and discard a card. For each opponent who doesn't, you draw a card.",
      type: "action",
    },
  ],
  cardNumber: 96,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "e8e8b6146e68fc314030023117c7ad8ef501a416",
  },
  franchise: "Little Mermaid",
  id: "1sb",
  inkType: ["emerald"],
  inkable: false,
  missingTests: true,
  name: "Ursula’s Trickery",
  set: "004",
  text: "Each opponent may choose and discard a card. For each opponent who doesn't, you draw a card.",
};
