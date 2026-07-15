import type { ActionCard } from "@tcg/lorcana-types";

export const candyDrift: ActionCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 5,
        stat: "strength",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "modify-stat",
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
