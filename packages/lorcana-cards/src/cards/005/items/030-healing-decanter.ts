import type { ItemCard } from "@tcg/lorcana-types";

export const healingDecanter: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        type: "remove-damage",
        amount: 2,
        upTo: true,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      id: "el0-1",
      text: "RENEWING ESSENCE {E} — Remove up to 2 damage from chosen character.",
      type: "activated",
    },
  ],
  cardNumber: 30,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "348f908de809da5a26e09ba10a1c397b6f7dbfa5",
  },
  franchise: "Lorcana",
  id: "el0",
  inkType: ["amber"],
  inkable: true,
  missingTests: true,
  name: "Healing Decanter",
  set: "005",
  text: "RENEWING ESSENCE {E} — Remove up to 2 damage from chosen character.",
};
