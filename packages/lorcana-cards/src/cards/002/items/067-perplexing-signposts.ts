import type { ItemCard } from "@tcg/lorcana-types";

export const perplexingSignposts: ItemCard = {
  id: "nv1",
  cardType: "item",
  name: "Perplexing Signposts",
  inkType: ["amethyst"],
  franchise: "Alice in Wonderland",
  set: "002",
  text: "TO WONDERLAND Banish this item — Return chosen character of yours to your hand.",
  cost: 2,
  cardNumber: 67,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "560069c50fe9ddb3a3f3ce8b2aefc1174c7eb7fc",
  },
  abilities: [
    {
      id: "nv1-1",
      type: "activated",
      effect: {
        type: "return-to-hand",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "TO WONDERLAND Banish this item — Return chosen character of yours to your hand.",
    },
  ],
};
