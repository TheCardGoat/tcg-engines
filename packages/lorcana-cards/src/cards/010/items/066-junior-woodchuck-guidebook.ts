import type { ItemCard } from "@tcg/lorcana-types";

export const juniorWoodchuckGuidebook: ItemCard = {
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        amount: 2,
        target: "CONTROLLER",
        type: "draw",
      },
      id: "ebe-1",
      text: "THE BOOK KNOWS EVERYTHING {E}, 1 {I}, Banish this item — Draw 2 cards.",
      type: "activated",
    },
  ],
  cardNumber: 66,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "339967997c7a01daf66e8ad1ea06a87e9950b162",
  },
  franchise: "Ducktales",
  id: "ebe",
  inkType: ["amethyst"],
  inkable: true,
  name: "Junior Woodchuck Guidebook",
  set: "010",
  text: "THE BOOK KNOWS EVERYTHING {E}, 1 {I}, Banish this item — Draw 2 cards.",
};
