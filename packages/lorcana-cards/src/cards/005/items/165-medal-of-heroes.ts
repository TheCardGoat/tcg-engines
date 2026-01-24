import type { ItemCard } from "@tcg/lorcana-types";

export const medalOfHeroes: ItemCard = {
  id: "b7p",
  cardType: "item",
  name: "Medal of Heroes",
  inkType: ["sapphire"],
  franchise: "Wreck It Ralph",
  set: "005",
  text: "CONGRATULATIONS, SOLDIER {E}, 2 {I}, Banish this item — Chosen character of yours gets +2 {L} this turn.",
  cost: 2,
  cardNumber: 165,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "286a732f67c5d41fdf485c1310e810e1f5b650f5",
  },
  abilities: [
    {
      id: "b7p-1",
      type: "activated",
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
      text: "CONGRATULATIONS, SOLDIER {E}, 2 {I}, Banish this item — Chosen character of yours gets +2 {L} this turn.",
    },
  ],
};
