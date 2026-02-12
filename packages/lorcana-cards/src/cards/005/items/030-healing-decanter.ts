import type { ItemCard } from "@tcg/lorcana-types";

export const healingDecanter: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        amount: 2,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "remove-damage",
        upTo: true,
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
