import type { ItemCard } from "@tcg/lorcana-types";

export const trainingStaff: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        value: 2,
        duration: "this-turn",
      },
      id: "1rn-1",
      text: "PRECISION STRIKE {E}, 1 {I} — Chosen character gains Challenger +2 this turn.",
      type: "activated",
    },
  ],
  cardNumber: 204,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "e59a60896a2cea72441d79546048b4cce3a5ed23",
  },
  franchise: "Mulan",
  id: "1rn",
  inkType: ["steel"],
  inkable: true,
  missingTests: true,
  name: "Training Staff",
  set: "007",
  text: "PRECISION STRIKE {E}, 1 {I} — Chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
};
