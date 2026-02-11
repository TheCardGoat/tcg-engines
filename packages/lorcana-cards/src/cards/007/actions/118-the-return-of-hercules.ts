import type { ActionCard } from "@tcg/lorcana-types";

export const theReturnOfHercules: ActionCard = {
  abilities: [
    {
      effect: {
        type: "play-card",
        from: "hand",
        cost: "free",
      },
      id: "nej-1",
      text: "Each player may reveal a character card from their hand and play it for free.",
      type: "action",
    },
  ],
  cardNumber: 118,
  cardType: "action",
  cost: 5,
  externalIds: {
    ravensburger: "545963749a1038d0c00d90cc484c66acfc11a852",
  },
  franchise: "Hercules",
  id: "nej",
  inkType: ["emerald"],
  inkable: true,
  missingTests: true,
  name: "The Return of Hercules",
  set: "007",
  text: "Each player may reveal a character card from their hand and play it for free.",
};
