import type { ActionCard } from "@tcg/lorcana-types";

export const smash: ActionCard = {
  abilities: [
    {
      effect: {
        amount: 3,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "deal-damage",
      },
      id: "dvd-1",
      text: "Deal 3 damage to chosen character.",
      type: "action",
    },
  ],
  cardNumber: 198,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "31fe827aea4cf5f6ace7de2c21de0b5f6b783858",
  },
  franchise: "Frozen",
  id: "dvd",
  inkType: ["steel"],
  inkable: true,
  missingTests: true,
  name: "Smash",
  set: "009",
  text: "Deal 3 damage to chosen character.",
};
