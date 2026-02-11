import type { ItemCard } from "@tcg/lorcana-types";

export const lastCannon: ItemCard = {
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
        value: 3,
        duration: "this-turn",
      },
      id: "u1y-1",
      text: "ARM YOURSELF 1 {I}, Banish this item — Chosen character gains Challenger +3 this turn.",
      type: "activated",
    },
  ],
  cardNumber: 202,
  cardType: "item",
  cost: 1,
  externalIds: {
    ravensburger: "6c5152c3b21edb6a64d7891cda39fae29a7ee4e2",
  },
  franchise: "Mulan",
  id: "u1y",
  inkType: ["steel"],
  inkable: true,
  missingTests: true,
  name: "Last Cannon",
  set: "002",
  text: "ARM YOURSELF 1 {I}, Banish this item — Chosen character gains Challenger +3 this turn. (They get +3 {S} while challenging.)",
};
