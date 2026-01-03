import type { ActionCard } from "@tcg/lorcana-types";

export const SmashUndefined: ActionCard = {
  id: "ub4",
  cardType: "action",
  name: "Smash",
  version: "undefined",
  fullName: "Smash - undefined",
  inkType: ["steel"],
  franchise: "Disney",
  set: "001",
  text: "Deal 3 damage to chosen character.",
  cost: 3,
  cardNumber: 200,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
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
    },
  ],
};
