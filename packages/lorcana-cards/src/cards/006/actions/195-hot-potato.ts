import type { ActionCard } from "@tcg/lorcana-types";

export const hotPotato: ActionCard = {
  abilities: [
    {
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
      id: "jnj-2",
      text: "- Deal 2 damage to chosen character.",
      type: "action",
    },
  ],
  cardNumber: 195,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "46d569174be105bf3722b7146e7d4b850b976412",
  },
  franchise: "Lilo and Stitch",
  id: "jnj",
  inkType: ["steel"],
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  name: "Hot Potato",
  set: "006",
  text: "Choose one:\n- Deal 2 damage to chosen character.\n- Banish chosen item.",
};
