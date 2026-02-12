import type { ItemCard } from "@tcg/lorcana-types";

export const swordInTheStone: ItemCard = {
  abilities: [
    {
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
      id: "pw4-1",
      text: "{E}, 2 {I} — Chosen character gets +1 {S} this turn for each 1 damage on them.",
      type: "activated",
    },
  ],
  cardNumber: 136,
  cardType: "item",
  cost: 1,
  externalIds: {
    ravensburger: "5d516a030cbb00532537cf0ee3c543c4989de0e6",
  },
  franchise: "Sword in the Stone",
  id: "pw4",
  inkType: ["ruby"],
  inkable: false,
  missingTests: true,
  name: "Sword in the Stone",
  set: "002",
  text: "{E}, 2 {I} — Chosen character gets +1 {S} this turn for each 1 damage on them.",
};
