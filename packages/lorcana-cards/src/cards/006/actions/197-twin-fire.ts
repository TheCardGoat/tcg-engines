import type { ActionCard } from "@tcg/lorcana-types";

export const twinFire: ActionCard = {
  abilities: [
    {
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
      id: "w3l-1",
      text: "Deal 2 damage to chosen character. Then, you may choose and discard a card to deal 2 damage to another chosen character.",
      type: "action",
    },
  ],
  cardNumber: 197,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "73b07fd4a3e3b908b93c8d9272c0d97db0f6e2ff",
  },
  franchise: "Peter Pan",
  id: "w3l",
  inkType: ["steel"],
  inkable: false,
  missingTests: true,
  name: "Twin Fire",
  set: "006",
  text: "Deal 2 damage to chosen character. Then, you may choose and discard a card to deal 2 damage to another chosen character.",
};
