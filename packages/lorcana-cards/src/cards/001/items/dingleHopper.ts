import type { ItemCard } from "@tcg/lorcana-types";

export const dinglehopperundefined: ItemCard = {
  abilities: [
    {
      effect: {
        amount: 1,
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
      id: "qef-1",
      text: "**STRAIGHTEN HAIR** {E} - Remove up to 1 damage from chosen character.",
      type: "action",
    },
  ],
  cardNumber: 32,
  cardType: "item",
  cost: 1,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Dinglehopper - undefined",
  id: "qef",
  inkType: ["amber"],
  inkable: true,
  name: "Dinglehopper",
  set: "001",
  text: "**STRAIGHTEN HAIR** {E} - Remove up to 1 damage from chosen character.",
  version: "undefined",
};
