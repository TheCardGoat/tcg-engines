import type { ItemCard } from "@tcg/lorcana-types";

export const tritonsTrident: ItemCard = {
  id: "l9u",
  cardType: "item",
  name: "Triton's Trident",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "004",
  text: "SYMBOL OF POWER Banish this item — Chosen character gets +1 {S} this turn for each card in your hand.",
  cost: 2,
  cardNumber: 66,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4cac163f4d3f43aef8387cb36619d3521d9b290d",
  },
  abilities: [
    {
      id: "l9u-1",
      type: "activated",
      cost: { exert: true },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        duration: "this-turn",
      },
      text: "SYMBOL OF POWER Banish this item — Chosen character gets +1 {S} this turn for each card in your hand.",
    },
  ],
};
