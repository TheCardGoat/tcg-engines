import type { ActionCard } from "@tcg/lorcana-types";

export const avalanche: ActionCard = {
  abilities: [
    {
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
      id: "1pv-1",
      text: "Deal 1 damage to each opposing character. You may banish chosen location.",
      type: "action",
    },
  ],
  cardNumber: 195,
  cardType: "action",
  cost: 4,
  externalIds: {
    ravensburger: "dd99c25c4f87c03bd08c6475bb933b3a8e370b00",
  },
  franchise: "Mulan",
  id: "1pv",
  inkType: ["steel"],
  inkable: false,
  missingTests: true,
  name: "Avalanche",
  set: "004",
  text: "Deal 1 damage to each opposing character. You may banish chosen location.",
};
