import type { ItemCard } from "@tcg/lorcana-types";

export const healingDecanter: ItemCard = {
  id: "el0",
  cardType: "item",
  name: "Healing Decanter",
  inkType: ["amber"],
  franchise: "Lorcana",
  set: "005",
  text: "RENEWING ESSENCE {E} — Remove up to 2 damage from chosen character.",
  cost: 2,
  cardNumber: 30,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "348f908de809da5a26e09ba10a1c397b6f7dbfa5",
  },
  abilities: [
    {
      id: "el0-1",
      type: "activated",
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
      text: "RENEWING ESSENCE {E} — Remove up to 2 damage from chosen character.",
    },
  ],
};
