import type { ItemCard } from "@tcg/lorcana-types";

export const juniorWoodchuckGuidebook: ItemCard = {
  id: "ebe",
  cardType: "item",
  name: "Junior Woodchuck Guidebook",
  inkType: ["amethyst"],
  franchise: "Ducktales",
  set: "010",
  text: "THE BOOK KNOWS EVERYTHING {E}, 1 {I}, Banish this item — Draw 2 cards.",
  cost: 2,
  cardNumber: 66,
  inkable: true,
  externalIds: {
    ravensburger: "339967997c7a01daf66e8ad1ea06a87e9950b162",
  },
  abilities: [
    {
      id: "ebe-1",
      type: "activated",
      effect: {
        type: "draw",
        amount: 2,
        target: "CONTROLLER",
      },
      text: "THE BOOK KNOWS EVERYTHING {E}, 1 {I}, Banish this item — Draw 2 cards.",
    },
  ],
};
