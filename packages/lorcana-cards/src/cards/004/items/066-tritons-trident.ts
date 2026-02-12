import type { ItemCard } from "@tcg/lorcana-types";

export const tritonsTrident: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "strength",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "modify-stat",
      },
      id: "l9u-1",
      text: "SYMBOL OF POWER Banish this item — Chosen character gets +1 {S} this turn for each card in your hand.",
      type: "activated",
    },
  ],
  cardNumber: 66,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "4cac163f4d3f43aef8387cb36619d3521d9b290d",
  },
  franchise: "Little Mermaid",
  id: "l9u",
  inkType: ["amethyst"],
  inkable: true,
  missingTests: true,
  name: "Triton's Trident",
  set: "004",
  text: "SYMBOL OF POWER Banish this item — Chosen character gets +1 {S} this turn for each card in your hand.",
};
