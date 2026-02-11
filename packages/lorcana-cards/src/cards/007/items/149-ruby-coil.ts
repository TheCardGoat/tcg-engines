import type { ItemCard } from "@tcg/lorcana-types";

export const rubyCoil: ItemCard = {
  abilities: [
    {
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
      id: "1mn-1",
      name: "CRIMSON SPARK",
      text: "CRIMSON SPARK During your turn, whenever a card is put into your inkwell, chosen character gets +2 {S} this turn.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
  ],
  cardNumber: 149,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "d250ec35251eedb4e3d598f75f217e0acca62570",
  },
  franchise: "Lorcana",
  id: "1mn",
  inkType: ["ruby"],
  inkable: true,
  missingTests: true,
  name: "Ruby Coil",
  set: "007",
  text: "CRIMSON SPARK During your turn, whenever a card is put into your inkwell, chosen character gets +2 {S} this turn.",
};
