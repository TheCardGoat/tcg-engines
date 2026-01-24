import type { ItemCard } from "@tcg/lorcana-types";

export const vitalisphere: ItemCard = {
  id: "fzw",
  cardType: "item",
  name: "Vitalisphere",
  inkType: ["ruby"],
  franchise: "Lorcana",
  set: "004",
  text: "EXTRACT OF RUBY 1 {I}, Banish this item — Chosen character gains Rush and gets +2 {S} this turn. (They can challenge the turn they're played.)",
  cost: 1,
  cardNumber: 134,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "39a768502f12e152241c2e471fcc3ba9e2aaad51",
  },
  abilities: [
    {
      id: "fzw-1",
      type: "activated",
      cost: { exert: true },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "gain-keyword",
            keyword: "Rush",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "modify-stat",
            stat: "strength",
            modifier: 2,
            target: "CHOSEN_CHARACTER",
            duration: "this-turn",
          },
        ],
      },
      text: "EXTRACT OF RUBY 1 {I}, Banish this item — Chosen character gains Rush and gets +2 {S} this turn.",
    },
  ],
};
