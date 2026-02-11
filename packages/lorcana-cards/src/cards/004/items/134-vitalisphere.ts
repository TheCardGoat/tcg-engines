import type { ItemCard } from "@tcg/lorcana-types";

export const vitalisphere: ItemCard = {
  abilities: [
    {
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
