import type { ItemCard } from "@tcg/lorcana-types";

export const rubyChromicon: ItemCard = {
  id: "1tf",
  cardType: "item",
  name: "Ruby Chromicon",
  inkType: ["ruby"],
  franchise: "Lorcana",
  set: "005",
  text: "RUBY LIGHT {E} — Chosen character gets +1 {S} this turn.",
  cost: 1,
  cardNumber: 134,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ed3b71854b6b1360da9cc9f442856fad6e2a743d",
  },
  abilities: [
    {
      id: "1tf-1",
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
      text: "RUBY LIGHT {E} — Chosen character gets +1 {S} this turn.",
    },
  ],
};
