import type { ItemCard } from "@tcg/lorcana-types";

export const wildcatsWrench: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        amount: 2,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["location"],
        },
        type: "remove-damage",
        upTo: true,
      },
      id: "1wk-1",
      text: "REBUILD {E} — Remove up to 2 damage from chosen location.",
      type: "activated",
    },
  ],
  cardNumber: 31,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "f6b270ae0092ca7fdae55368f489fc60ad77d484",
  },
  franchise: "Talespin",
  id: "1wk",
  inkType: ["amber"],
  inkable: true,
  missingTests: true,
  name: "Wildcat's Wrench",
  set: "003",
  text: "REBUILD {E} — Remove up to 2 damage from chosen location.",
};
