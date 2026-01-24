import type { ActionCard } from "@tcg/lorcana-types";

export const holdStill: ActionCard = {
  id: "1cm",
  cardType: "action",
  name: "Hold Still",
  inkType: ["amber"],
  franchise: "Beauty and the Beast",
  set: "002",
  text: "Remove up to 4 damage from chosen character.",
  cost: 2,
  cardNumber: 28,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "af7ad8e2f2e28d3c3a1323718ae5d87054755485",
  },
  abilities: [
    {
      id: "1cm-1",
      type: "action",
      effect: {
        type: "remove-damage",
        amount: 4,
        upTo: true,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "Remove up to 4 damage from chosen character.",
    },
  ],
};
