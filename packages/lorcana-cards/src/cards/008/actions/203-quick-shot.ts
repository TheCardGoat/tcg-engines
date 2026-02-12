import type { ActionCard } from "@tcg/lorcana-types";

export const quickShot: ActionCard = {
  abilities: [
    {
      effect: {
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
        type: "sequence",
      },
      id: "1ex-1",
      text: "Deal 1 damage to chosen character. Draw a card.",
      type: "action",
    },
  ],
  cardNumber: 203,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "b7869c5472bc41c5832262ed91df5e977a88dd47",
  },
  franchise: "Lilo and Stitch",
  id: "1ex",
  inkType: ["steel"],
  inkable: false,
  missingTests: true,
  name: "Quick Shot",
  set: "008",
  text: "Deal 1 damage to chosen character. Draw a card.",
};
