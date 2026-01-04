import type { ActionCard } from "@tcg/lorcana-types";

export const fireTheCannonsundefined: ActionCard = {
  id: "lhl",
  cardType: "action",
  name: "Fire the Cannons!",
  version: "undefined",
  fullName: "Fire the Cannons! - undefined",
  inkType: ["steel"],
  franchise: "Disney",
  set: "001",
  text: "Deal 2 damage to chosen character.",
  cost: 1,
  cardNumber: 197,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      id: "lhl-1",
      text: "Deal 2 damage to chosen character.",
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
    },
  ],
};
