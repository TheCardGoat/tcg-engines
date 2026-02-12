import type { ItemCard } from "@tcg/lorcana-types";

export const rubyCoil: ItemCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 2,
        stat: "strength",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "modify-stat",
      },
      id: "1mn-1",
      name: "CRIMSON SPARK",
      text: "CRIMSON SPARK During your turn, whenever a card is put into your inkwell, chosen character gets +2 {S} this turn.",
      trigger: { event: "play", on: "SELF", timing: "when" },
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
