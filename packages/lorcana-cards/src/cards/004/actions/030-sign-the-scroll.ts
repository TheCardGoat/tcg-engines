import type { ActionCard } from "@tcg/lorcana-types";

export const signTheScroll: ActionCard = {
  abilities: [
    {
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
            type: "gain-lore",
            amount: 2,
          },
        ],
      },
      id: "ggh-1",
      text: "Each opponent may choose and discard a card. For each opponent who doesn't, you gain 2 lore.",
      type: "action",
    },
  ],
  cardNumber: 30,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "3b50bdfe85abebdd4bce7a6a74f0c24ee3a3d869",
  },
  franchise: "Little Mermaid",
  id: "ggh",
  inkType: ["amber"],
  inkable: false,
  missingTests: true,
  name: "Sign the Scroll",
  set: "004",
  text: "Each opponent may choose and discard a card. For each opponent who doesn't, you gain 2 lore.",
};
