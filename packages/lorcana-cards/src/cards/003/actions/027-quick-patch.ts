import type { ActionCard } from "@tcg/lorcana-types";

export const quickPatch: ActionCard = {
  abilities: [
    {
      effect: {
        amount: 3,
        target: {
          cardTypes: ["location"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "remove-damage",
        upTo: true,
      },
      id: "r4j-1",
      text: "Remove up to 3 damage from chosen location.",
      type: "action",
    },
  ],
  cardNumber: 27,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "61c39a8f8d441689638761be897e2f215f6def30",
  },
  franchise: "Talespin",
  id: "r4j",
  inkType: ["amber"],
  inkable: true,
  missingTests: true,
  name: "Quick Patch",
  set: "003",
  text: "Remove up to 3 damage from chosen location.",
};
