import type { ActionCard } from "@tcg/lorcana-types";

export const quickPatch: ActionCard = {
  id: "r4j",
  cardType: "action",
  name: "Quick Patch",
  inkType: ["amber"],
  franchise: "Talespin",
  set: "003",
  text: "Remove up to 3 damage from chosen location.",
  cost: 1,
  cardNumber: 27,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "61c39a8f8d441689638761be897e2f215f6def30",
  },
  abilities: [
    {
      id: "r4j-1",
      type: "action",
      effect: {
        type: "remove-damage",
        amount: 3,
        upTo: true,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["location"],
        },
      },
      text: "Remove up to 3 damage from chosen location.",
    },
  ],
};
