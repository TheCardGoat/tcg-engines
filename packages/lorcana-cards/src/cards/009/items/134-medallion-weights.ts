import type { ItemCard } from "@tcg/lorcana-types";

export const medallionWeights: ItemCard = {
  id: "1rm",
  cardType: "item",
  name: "Medallion Weights",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "009",
  text: "DISCIPLINE AND STRENGTH {E}, 2 {I} — Chosen character gets +2 {S} this turn. Whenever they challenge another character this turn, you may draw a card.",
  cost: 2,
  cardNumber: 134,
  inkable: true,
  externalIds: {
    ravensburger: "e357b66e6d92b0712271abd9ecb5a28d7d32212c",
  },
  abilities: [
    {
      id: "1rm-1",
      type: "activated",
      cost: {
        exert: true,
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      text: "DISCIPLINE AND STRENGTH {E}, 2 {I} — Chosen character gets +2 {S} this turn. Whenever they challenge another character this turn, you may draw a card.",
    },
  ],
};
