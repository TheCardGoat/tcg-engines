import type { ItemCard } from "@tcg/lorcana-types";

export const beastsMirror: ItemCard = {
  id: "6wc",
  cardType: "item",
  name: "Beast’s Mirror",
  inkType: ["steel"],
  franchise: "Beauty and the Beast",
  set: "009",
  text: "SHOW ME {E}, 3 {I} — If you have no cards in your hand, draw a card.",
  cost: 2,
  cardNumber: 203,
  inkable: true,
  externalIds: {
    ravensburger: "18dcabfdfb43e19ba99de9e95d9530bce929e93e",
  },
  abilities: [
    {
      id: "6wc-1",
      type: "activated",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have no cards in your hand",
        },
        then: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
    },
  ],
};
