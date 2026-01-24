import type { ActionCard } from "@tcg/lorcana-types";

export const signTheScroll: ActionCard = {
  id: "ggh",
  cardType: "action",
  name: "Sign the Scroll",
  inkType: ["amber"],
  franchise: "Little Mermaid",
  set: "004",
  text: "Each opponent may choose and discard a card. For each opponent who doesn't, you gain 2 lore.",
  cost: 3,
  cardNumber: 30,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "3b50bdfe85abebdd4bce7a6a74f0c24ee3a3d869",
  },
  abilities: [
    {
      id: "ggh-1",
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
            type: "gain-lore",
            amount: 2,
          },
        ],
      },
      text: "Each opponent may choose and discard a card. For each opponent who doesn't, you gain 2 lore.",
    },
  ],
};
