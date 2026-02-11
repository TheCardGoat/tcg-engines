import type { ItemCard } from "@tcg/lorcana-types";

export const fangCrossbow: ItemCard = {
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -2,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        duration: "this-turn",
      },
      id: "166-1",
      text: "CAREFUL AIM {E}, 2 {I} — Chosen character gets -2 {S} this turn.",
      type: "activated",
    },
  ],
  cardNumber: 166,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "9a04995b8adf69799180f04a035f3cabff2cfec9",
  },
  franchise: "Raya and the Last Dragon",
  id: "166",
  inkType: ["sapphire"],
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  name: "Fang Crossbow",
  set: "002",
  text: "CAREFUL AIM {E}, 2 {I} — Chosen character gets -2 {S} this turn.\nSTAY BACK! {E}, Banish this item — Banish chosen Dragon character.",
};
