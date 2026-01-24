import type { ItemCard } from "@tcg/lorcana-types";

export const wildcatsWrench: ItemCard = {
  id: "1wk",
  cardType: "item",
  name: "Wildcat's Wrench",
  inkType: ["amber"],
  franchise: "Talespin",
  set: "003",
  text: "REBUILD {E} — Remove up to 2 damage from chosen location.",
  cost: 2,
  cardNumber: 31,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f6b270ae0092ca7fdae55368f489fc60ad77d484",
  },
  abilities: [
    {
      id: "1wk-1",
      type: "activated",
      cost: { exert: true },
      effect: {
        type: "remove-damage",
        amount: 2,
        upTo: true,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["location"],
        },
      },
      text: "REBUILD {E} — Remove up to 2 damage from chosen location.",
    },
  ],
};
