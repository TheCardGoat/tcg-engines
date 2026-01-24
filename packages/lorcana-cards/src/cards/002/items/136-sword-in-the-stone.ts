import type { ItemCard } from "@tcg/lorcana-types";

export const swordInTheStone: ItemCard = {
  id: "pw4",
  cardType: "item",
  name: "Sword in the Stone",
  inkType: ["ruby"],
  franchise: "Sword in the Stone",
  set: "002",
  text: "{E}, 2 {I} — Chosen character gets +1 {S} this turn for each 1 damage on them.",
  cost: 1,
  cardNumber: 136,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "5d516a030cbb00532537cf0ee3c543c4989de0e6",
  },
  abilities: [
    {
      id: "pw4-1",
      type: "activated",
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
      text: "{E}, 2 {I} — Chosen character gets +1 {S} this turn for each 1 damage on them.",
    },
  ],
};
