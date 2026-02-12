import type { ItemCard } from "@tcg/lorcana-types";

export const rubyChromicon: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "strength",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "modify-stat",
      },
      id: "1tf-1",
      text: "RUBY LIGHT {E} — Chosen character gets +1 {S} this turn.",
      type: "activated",
    },
  ],
  cardNumber: 134,
  cardType: "item",
  cost: 1,
  externalIds: {
    ravensburger: "ed3b71854b6b1360da9cc9f442856fad6e2a743d",
  },
  franchise: "Lorcana",
  id: "1tf",
  inkType: ["ruby"],
  inkable: true,
  missingTests: true,
  name: "Ruby Chromicon",
  set: "005",
  text: "RUBY LIGHT {E} — Chosen character gets +1 {S} this turn.",
};
