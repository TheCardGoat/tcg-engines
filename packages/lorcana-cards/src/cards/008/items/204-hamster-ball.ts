import type { ItemCard } from "@tcg/lorcana-types";

export const hamsterBall: ItemCard = {
  id: "1s0",
  cardType: "item",
  name: "Hamster Ball",
  inkType: ["steel"],
  franchise: "Bolt",
  set: "008",
  text: "ROLL WITH THE PUNCHES {E}, 1 {I} — Chosen character with no damage gains Resist +2 until the start of your next turn. (Damage dealt to them is reduced by 2.)",
  cost: 3,
  cardNumber: 204,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "e6ae8927db279459b45121c140306a0e025a5c26",
  },
  abilities: [
    {
      id: "1s0-1",
      type: "activated",
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        value: 2,
      },
      text: "ROLL WITH THE PUNCHES {E}, 1 {I} — Chosen character with no damage gains Resist +2 until the start of your next turn.",
    },
  ],
};
