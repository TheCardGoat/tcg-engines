import type { ActionCard } from "@tcg/lorcana-types";

export const smash: ActionCard = {
  id: "dvd",
  cardType: "action",
  name: "Smash",
  inkType: ["steel"],
  franchise: "Frozen",
  set: "009",
  text: "Deal 3 damage to chosen character.",
  cost: 3,
  cardNumber: 198,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "31fe827aea4cf5f6ace7de2c21de0b5f6b783858",
  },
  abilities: [
    {
      id: "dvd-1",
      type: "action",
      effect: {
        type: "deal-damage",
        amount: 3,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "Deal 3 damage to chosen character.",
    },
  ],
};
