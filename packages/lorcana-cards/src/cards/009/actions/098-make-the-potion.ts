import type { ActionCard } from "@tcg/lorcana-types";

export const makeThePotion: ActionCard = {
  abilities: [
    {
      effect: {
        optionLabels: ["Banish chosen item.", "Deal 2 damage to chosen damaged character."],
        options: [
          {
            target: {
              cardTypes: ["item"],
              count: 1,
              owner: "any",
              selector: "chosen",
              zones: ["play"],
            },
            type: "banish",
          },
          {
            amount: 2,
            target: {
              cardTypes: ["character"],
              count: 1,
              owner: "any",
              selector: "chosen",
              zones: ["play"],
            },
            type: "deal-damage",
          },
        ],
        type: "choice",
      },
      id: "db6-1",
      text: "Choose one: • Banish chosen item. • Deal 2 damage to chosen damaged character.",
      type: "action",
    },
  ],
  cardNumber: 98,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "2ff92870c51a6d0ed82d95f43850abf04ef72c3d",
  },
  franchise: "Snow White",
  id: "db6",
  inkType: ["emerald"],
  inkable: false,
  missingTests: true,
  name: "Make the Potion",
  set: "009",
  text: "Choose one: • Banish chosen item. • Deal 2 damage to chosen damaged character.",
};
