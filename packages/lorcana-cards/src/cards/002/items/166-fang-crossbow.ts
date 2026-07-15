import type { ItemCard } from "@tcg/lorcana-types";

export const fangCrossbow: ItemCard = {
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        duration: "this-turn",
        modifier: -2,
        stat: "strength",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "modify-stat",
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
