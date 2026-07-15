import type { ItemCard } from "@tcg/lorcana-types";

export const beastsMirror: ItemCard = {
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        condition: {
          expression: "you have no cards in your hand",
          type: "if",
        },
        then: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "conditional",
      },
      id: "6wc-1",
      text: "SHOW ME {E}, 3 {I} — If you have no cards in your hand, draw a card.",
      type: "activated",
    },
  ],
  cardNumber: 203,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "18dcabfdfb43e19ba99de9e95d9530bce929e93e",
  },
  franchise: "Beauty and the Beast",
  id: "6wc",
  inkType: ["steel"],
  inkable: true,
  name: "Beast’s Mirror",
  set: "009",
  text: "SHOW ME {E}, 3 {I} — If you have no cards in your hand, draw a card.",
};
