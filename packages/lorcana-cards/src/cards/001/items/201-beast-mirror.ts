import type { ItemCard } from "@tcg/lorcana-types";

export const BeastUndefined: ItemCard = {
  id: "ysg",
  cardType: "item",
  name: "Beast",
  version: "undefined",
  fullName: "Beast - undefined",
  inkType: ["steel"],
  franchise: "Disney",
  set: "001",
  text: "**SHOW ME** {E}, 3 {I} - If you have no cards in your hand, draw a card.",
  cost: 2,
  cardNumber: 201,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**SHOW ME** {E}, 3 {I} - If you have no cards in your hand, draw a card.",
      id: "ysg-1",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have no cards in your hand",
        },
        then: {
          type: "draw",
          text: "**SHOW ME** {E}, 3 {I} - If you have no cards in your hand, draw a card.",
          id: "ysg-2",
          amount: 1,
          target: "CONTROLLER",
        },
      },
    },
  ],
};
