import type { ActionCard } from "@tcg/lorcana-types";

export const quickShot: ActionCard = {
  id: "1ex",
  cardType: "action",
  name: "Quick Shot",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "008",
  text: "Deal 1 damage to chosen character. Draw a card.",
  cost: 2,
  cardNumber: 203,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "b7869c5472bc41c5832262ed91df5e977a88dd47",
  },
  abilities: [
    {
      id: "1ex-1",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "deal-damage",
            amount: 1,
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
      text: "Deal 1 damage to chosen character. Draw a card.",
    },
  ],
};
