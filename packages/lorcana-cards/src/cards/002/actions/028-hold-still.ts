import type { ActionCard } from "@tcg/lorcana-types";

export const holdStill: ActionCard = {
  abilities: [
    {
      effect: {
        amount: 4,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "remove-damage",
        upTo: true,
      },
      id: "1cm-1",
      text: "Remove up to 4 damage from chosen character.",
      type: "action",
    },
  ],
  cardNumber: 28,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "af7ad8e2f2e28d3c3a1323718ae5d87054755485",
  },
  franchise: "Beauty and the Beast",
  id: "1cm",
  inkType: ["amber"],
  inkable: true,
  missingTests: true,
  name: "Hold Still",
  set: "002",
  text: "Remove up to 4 damage from chosen character.",
};
