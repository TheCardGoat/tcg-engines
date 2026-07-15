import type { ItemCard } from "@tcg/lorcana-types";

export const hamsterBall: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        keyword: "Resist",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
        value: 2,
      },
      id: "1s0-1",
      text: "ROLL WITH THE PUNCHES {E}, 1 {I} — Chosen character with no damage gains Resist +2 until the start of your next turn.",
      type: "activated",
    },
  ],
  cardNumber: 204,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "e6ae8927db279459b45121c140306a0e025a5c26",
  },
  franchise: "Bolt",
  id: "1s0",
  inkType: ["steel"],
  inkable: false,
  missingTests: true,
  name: "Hamster Ball",
  set: "008",
  text: "ROLL WITH THE PUNCHES {E}, 1 {I} — Chosen character with no damage gains Resist +2 until the start of your next turn. (Damage dealt to them is reduced by 2.)",
};
