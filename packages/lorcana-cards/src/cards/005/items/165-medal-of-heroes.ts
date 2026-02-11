import type { ItemCard } from "@tcg/lorcana-types";

export const medalOfHeroes: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 2,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        duration: "this-turn",
      },
      id: "b7p-1",
      text: "CONGRATULATIONS, SOLDIER {E}, 2 {I}, Banish this item — Chosen character of yours gets +2 {L} this turn.",
      type: "activated",
    },
  ],
  cardNumber: 165,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "286a732f67c5d41fdf485c1310e810e1f5b650f5",
  },
  franchise: "Wreck It Ralph",
  id: "b7p",
  inkType: ["sapphire"],
  inkable: true,
  missingTests: true,
  name: "Medal of Heroes",
  set: "005",
  text: "CONGRATULATIONS, SOLDIER {E}, 2 {I}, Banish this item — Chosen character of yours gets +2 {L} this turn.",
};
