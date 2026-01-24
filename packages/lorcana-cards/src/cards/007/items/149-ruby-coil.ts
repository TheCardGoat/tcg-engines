import type { ItemCard } from "@tcg/lorcana-types";

export const rubyCoil: ItemCard = {
  id: "1mn",
  cardType: "item",
  name: "Ruby Coil",
  inkType: ["ruby"],
  franchise: "Lorcana",
  set: "007",
  text: "CRIMSON SPARK During your turn, whenever a card is put into your inkwell, chosen character gets +2 {S} this turn.",
  cost: 2,
  cardNumber: 149,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d250ec35251eedb4e3d598f75f217e0acca62570",
  },
  abilities: [
    {
      id: "1mn-1",
      type: "triggered",
      name: "CRIMSON SPARK",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        duration: "this-turn",
      },
      text: "CRIMSON SPARK During your turn, whenever a card is put into your inkwell, chosen character gets +2 {S} this turn.",
    },
  ],
};
