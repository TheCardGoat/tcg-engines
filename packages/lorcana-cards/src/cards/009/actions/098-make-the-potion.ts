import type { ActionCard } from "@tcg/lorcana-types";

export const makeThePotion: ActionCard = {
  id: "db6",
  cardType: "action",
  name: "Make the Potion",
  inkType: ["emerald"],
  franchise: "Snow White",
  set: "009",
  text: "Choose one: • Banish chosen item. • Deal 2 damage to chosen damaged character.",
  cost: 2,
  cardNumber: 98,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "2ff92870c51a6d0ed82d95f43850abf04ef72c3d",
  },
  abilities: [
    {
      id: "db6-1",
      type: "action",
      effect: {
        type: "choice",
        options: [
          {
            type: "banish",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["item"],
            },
          },
          {
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
        ],
        optionLabels: [
          "Banish chosen item.",
          "Deal 2 damage to chosen damaged character.",
        ],
      },
      text: "Choose one: • Banish chosen item. • Deal 2 damage to chosen damaged character.",
    },
  ],
};
