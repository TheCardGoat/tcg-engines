import type { ItemCard } from "@tcg/lorcana-types";

export const DinglehopperUndefined: ItemCard = {
  id: "qef",
  cardType: "item",
  name: "Dinglehopper",
  version: "undefined",
  fullName: "Dinglehopper - undefined",
  inkType: ["amber"],
  franchise: "Disney",
  set: "001",
  text: "**STRAIGHTEN HAIR** {E} - Remove up to 1 damage from chosen character.",
  cost: 1,
  cardNumber: 32,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      effect: {
        type: "remove-damage",
        amount: 1,
        upTo: true,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
};
