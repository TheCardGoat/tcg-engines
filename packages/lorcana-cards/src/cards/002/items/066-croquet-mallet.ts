import type { ItemCard } from "@tcg/lorcana-types";

export const croquetMallet: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        duration: "this-turn",
        keyword: "Rush",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "gain-keyword",
      },
      id: "1s8-1",
      text: "HURTLING HEDGEHOG Banish this item — Chosen character gains Rush this turn.",
      type: "activated",
    },
  ],
  cardNumber: 66,
  cardType: "item",
  cost: 1,
  externalIds: {
    ravensburger: "e970bdbe2afc322fb9f32c852422fe71892d93a6",
  },
  franchise: "Alice in Wonderland",
  id: "1s8",
  inkType: ["amethyst"],
  inkable: false,
  missingTests: true,
  name: "Croquet Mallet",
  set: "002",
  text: "HURTLING HEDGEHOG Banish this item — Chosen character gains Rush this turn. (They can challenge the turn they're played.)",
};
