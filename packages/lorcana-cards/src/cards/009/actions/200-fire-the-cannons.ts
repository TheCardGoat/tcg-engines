import type { ActionCard } from "@tcg/lorcana-types";

export const fireTheCannons: ActionCard = {
  abilities: [
    {
      effect: {
        amount: 2,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "deal-damage",
      },
      id: "1pl-1",
      text: "Deal 2 damage to chosen character.",
      type: "action",
    },
  ],
  cardNumber: 200,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "dd9d07e58d8392f3d0e80b4241b33f20d81e96ac",
  },
  franchise: "Peter Pan",
  id: "1pl",
  inkType: ["steel"],
  inkable: false,
  missingTests: true,
  name: "Fire the Cannons!",
  set: "009",
  text: "Deal 2 damage to chosen character.",
};
