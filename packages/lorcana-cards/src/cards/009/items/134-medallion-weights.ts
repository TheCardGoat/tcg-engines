import type { ItemCard } from "@tcg/lorcana-types";

export const medallionWeights: ItemCard = {
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      id: "1rm-1",
      text: "DISCIPLINE AND STRENGTH {E}, 2 {I} — Chosen character gets +2 {S} this turn. Whenever they challenge another character this turn, you may draw a card.",
      type: "activated",
    },
  ],
  cardNumber: 134,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "e357b66e6d92b0712271abd9ecb5a28d7d32212c",
  },
  franchise: "Mulan",
  id: "1rm",
  inkType: ["ruby"],
  inkable: true,
  name: "Medallion Weights",
  set: "009",
  text: "DISCIPLINE AND STRENGTH {E}, 2 {I} — Chosen character gets +2 {S} this turn. Whenever they challenge another character this turn, you may draw a card.",
};
