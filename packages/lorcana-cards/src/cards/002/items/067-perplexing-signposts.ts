import type { ItemCard } from "@tcg/lorcana-types";

export const perplexingSignposts: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "return-to-hand",
      },
      id: "nv1-1",
      text: "TO WONDERLAND Banish this item — Return chosen character of yours to your hand.",
      type: "activated",
    },
  ],
  cardNumber: 67,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "560069c50fe9ddb3a3f3ce8b2aefc1174c7eb7fc",
  },
  franchise: "Alice in Wonderland",
  id: "nv1",
  inkType: ["amethyst"],
  inkable: false,
  missingTests: true,
  name: "Perplexing Signposts",
  set: "002",
  text: "TO WONDERLAND Banish this item — Return chosen character of yours to your hand.",
};
