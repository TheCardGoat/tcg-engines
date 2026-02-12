import type { ItemCard } from "@tcg/lorcana-types";

export const vitalisphere: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        steps: [
          {
            keyword: "Rush",
            target: {
              cardTypes: ["character"],
              count: 1,
              owner: "any",
              selector: "chosen",
              zones: ["play"],
            },
            type: "gain-keyword",
          },
          {
            duration: "this-turn",
            modifier: 2,
            stat: "strength",
            target: "CHOSEN_CHARACTER",
            type: "modify-stat",
          },
        ],
        type: "sequence",
      },
      id: "fzw-1",
      text: "EXTRACT OF RUBY 1 {I}, Banish this item — Chosen character gains Rush and gets +2 {S} this turn.",
      type: "activated",
    },
  ],
  cardNumber: 134,
  cardType: "item",
  cost: 1,
  externalIds: {
    ravensburger: "39a768502f12e152241c2e471fcc3ba9e2aaad51",
  },
  franchise: "Lorcana",
  id: "fzw",
  inkType: ["ruby"],
  inkable: true,
  missingTests: true,
  name: "Vitalisphere",
  set: "004",
  text: "EXTRACT OF RUBY 1 {I}, Banish this item — Chosen character gains Rush and gets +2 {S} this turn. (They can challenge the turn they're played.)",
};
