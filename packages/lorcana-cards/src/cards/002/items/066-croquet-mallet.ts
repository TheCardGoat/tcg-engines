import type { ItemCard } from "@tcg/lorcana-types";

export const croquetMallet: ItemCard = {
  id: "1s8",
  cardType: "item",
  name: "Croquet Mallet",
  inkType: ["amethyst"],
  franchise: "Alice in Wonderland",
  set: "002",
  text: "HURTLING HEDGEHOG Banish this item — Chosen character gains Rush this turn. (They can challenge the turn they're played.)",
  cost: 1,
  cardNumber: 66,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "e970bdbe2afc322fb9f32c852422fe71892d93a6",
  },
  abilities: [
    {
      id: "1s8-1",
      type: "activated",
      cost: { exert: true },
      effect: {
        type: "gain-keyword",
        keyword: "Rush",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        duration: "this-turn",
      },
      text: "HURTLING HEDGEHOG Banish this item — Chosen character gains Rush this turn.",
    },
  ],
};
