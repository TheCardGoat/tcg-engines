import type { ActionCard } from "@tcg/lorcana-types";

export const candyDrift: ActionCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 5,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        duration: "this-turn",
      },
      id: "18h-1",
      text: "Draw a card. Chosen character of yours gets +5 {S} this turn. At the end of your turn, banish them.",
      type: "action",
    },
  ],
  cardNumber: 39,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "a0153cbf8a3efb1e35d6007278e22a7c7006135b",
  },
  franchise: "Wreck It Ralph",
  id: "18h",
  inkType: ["amber", "ruby"],
  inkable: true,
  missingTests: true,
  name: "Candy Drift",
  set: "008",
  text: "Draw a card. Chosen character of yours gets +5 {S} this turn. At the end of your turn, banish them.",
};
