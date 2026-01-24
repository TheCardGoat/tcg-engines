import type { ActionCard } from "@tcg/lorcana-types";

export const ursulasTrickery: ActionCard = {
  id: "1sb",
  cardType: "action",
  name: "Ursula’s Trickery",
  inkType: ["emerald"],
  franchise: "Little Mermaid",
  set: "004",
  text: "Each opponent may choose and discard a card. For each opponent who doesn't, you draw a card.",
  cost: 1,
  cardNumber: 96,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "e8e8b6146e68fc314030023117c7ad8ef501a416",
  },
  abilities: [
    {
      id: "1sb-1",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "discard",
            amount: 1,
            target: "EACH_OPPONENT",
            chosen: true,
          },
          {
            type: "draw",
            amount: 1,
            target: "EACH_OPPONENT",
          },
        ],
      },
      text: "Each opponent may choose and discard a card. For each opponent who doesn't, you draw a card.",
    },
  ],
};
