import type { ActionCard } from "@tcg/lorcana-types";

export const theReturnOfHercules: ActionCard = {
  id: "nej",
  cardType: "action",
  name: "The Return of Hercules",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "007",
  text: "Each player may reveal a character card from their hand and play it for free.",
  cost: 5,
  cardNumber: 118,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "545963749a1038d0c00d90cc484c66acfc11a852",
  },
  abilities: [
    {
      id: "nej-1",
      type: "action",
      effect: {
        type: "play-card",
        from: "hand",
        cost: "free",
      },
      text: "Each player may reveal a character card from their hand and play it for free.",
    },
  ],
};
