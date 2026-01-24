import type { ItemCard } from "@tcg/lorcana-types";

export const steelChromicon: ItemCard = {
  id: "1lw",
  cardType: "item",
  name: "Steel Chromicon",
  inkType: ["steel"],
  franchise: "Lorcana",
  set: "005",
  text: "STEEL LIGHT {E} — Deal 1 damage to chosen character.",
  cost: 6,
  cardNumber: 202,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "d0ac5490b2e8a8b66aac820aa3ef992619b9524f",
  },
  abilities: [
    {
      id: "1lw-1",
      type: "activated",
      effect: {
        type: "deal-damage",
        amount: 1,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "STEEL LIGHT {E} — Deal 1 damage to chosen character.",
    },
  ],
};
