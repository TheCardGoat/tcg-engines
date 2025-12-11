import type { ItemCard } from "@tcg/lorcana";

export const juniorWoodchuckGuidebook: ItemCard = {
  id: "ebe",
  cardType: "item",
  name: "Junior Woodchuck Guidebook",
  inkType: ["amethyst"],
  franchise: "Ducktales",
  set: "010",
  text: "THE BOOK KNOWS EVERYTHING {E}, 1 {I}, Banish this item – Draw 2 cards.",
  cost: 2,
  cardNumber: 66,
  inkable: true,
  externalIds: {
    ravensburger: "339967997c7a01daf66e8ad1ea06a87e9950b162",
  },
  abilities: [
    {
      id: "ebe-1",
      text: "THE BOOK KNOWS EVERYTHING {E}, 1 {I}, Banish this item – Draw 2 cards.",
      name: "THE BOOK KNOWS EVERYTHING",
      type: "activated",
      cost: {
        exert: true,
        ink: 1,
        banishSelf: true,
      },
      effect: {
        type: "draw",
        amount: 2,
        target: "CONTROLLER",
      },
    },
  ],
};
