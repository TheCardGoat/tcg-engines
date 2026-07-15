import type { ItemCard } from "@tcg/lorcana-types";

export const steelChromicon: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        amount: 1,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "deal-damage",
      },
      id: "1lw-1",
      text: "STEEL LIGHT {E} — Deal 1 damage to chosen character.",
      type: "activated",
    },
  ],
  cardNumber: 202,
  cardType: "item",
  cost: 6,
  externalIds: {
    ravensburger: "d0ac5490b2e8a8b66aac820aa3ef992619b9524f",
  },
  franchise: "Lorcana",
  id: "1lw",
  inkType: ["steel"],
  inkable: false,
  missingTests: true,
  name: "Steel Chromicon",
  set: "005",
  text: "STEEL LIGHT {E} — Deal 1 damage to chosen character.",
};
