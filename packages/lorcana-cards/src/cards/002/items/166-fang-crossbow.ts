import type { ItemCard } from "@tcg/lorcana-types";

export const fangCrossbow: ItemCard = {
  id: "166",
  cardType: "item",
  name: "Fang Crossbow",
  inkType: ["sapphire"],
  franchise: "Raya and the Last Dragon",
  set: "002",
  text: "CAREFUL AIM {E}, 2 {I} — Chosen character gets -2 {S} this turn.\nSTAY BACK! {E}, Banish this item — Banish chosen Dragon character.",
  cost: 3,
  cardNumber: 166,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9a04995b8adf69799180f04a035f3cabff2cfec9",
  },
  abilities: [
    {
      id: "166-1",
      type: "activated",
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
      text: "CAREFUL AIM {E}, 2 {I} — Chosen character gets -2 {S} this turn.",
    },
  ],
};
