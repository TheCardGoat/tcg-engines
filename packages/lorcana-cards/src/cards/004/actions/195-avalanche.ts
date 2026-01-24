import type { ActionCard } from "@tcg/lorcana-types";

export const avalanche: ActionCard = {
  id: "1pv",
  cardType: "action",
  name: "Avalanche",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "004",
  text: "Deal 1 damage to each opposing character. You may banish chosen location.",
  cost: 4,
  cardNumber: 195,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "dd99c25c4f87c03bd08c6475bb933b3a8e370b00",
  },
  abilities: [
    {
      id: "1pv-1",
      type: "action",
      effect: {
        type: "optional",
        effect: {
          type: "banish",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["location"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "Deal 1 damage to each opposing character. You may banish chosen location.",
    },
  ],
};
