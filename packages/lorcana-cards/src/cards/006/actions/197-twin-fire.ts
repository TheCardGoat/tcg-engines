import type { ActionCard } from "@tcg/lorcana-types";

export const twinFire: ActionCard = {
  id: "w3l",
  cardType: "action",
  name: "Twin Fire",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "006",
  text: "Deal 2 damage to chosen character. Then, you may choose and discard a card to deal 2 damage to another chosen character.",
  cost: 2,
  cardNumber: 197,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "73b07fd4a3e3b908b93c8d9272c0d97db0f6e2ff",
  },
  abilities: [
    {
      id: "w3l-1",
      type: "action",
      effect: {
        type: "optional",
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
        chooser: "CONTROLLER",
      },
      text: "Deal 2 damage to chosen character. Then, you may choose and discard a card to deal 2 damage to another chosen character.",
    },
  ],
};
