import type { ActionCard } from "@tcg/lorcana-types";

export const fireTheCannons: ActionCard = {
  id: "1pl",
  cardType: "action",
  name: "Fire the Cannons!",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "009",
  text: "Deal 2 damage to chosen character.",
  cost: 1,
  cardNumber: 200,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "dd9d07e58d8392f3d0e80b4241b33f20d81e96ac",
  },
  abilities: [
    {
      id: "1pl-1",
      type: "action",
      effect: {
        type: "deal-damage",
        amount: 2,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "Deal 2 damage to chosen character.",
    },
  ],
};
