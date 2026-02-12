import type { ItemCard } from "@tcg/lorcana-types";

export const poohPirateShip: ItemCard = {
  abilities: [
    {
      effect: {
        type: "return-from-discard",
        target: "CONTROLLER",
      },
      id: "6g9-1",
      text: "MAKE A RESCUE {E}, 3 {I} – Return a Pirate character card from your discard to your hand.",
      type: "action",
    },
  ],
  cardNumber: 32,
  cardType: "item",
  cost: 1,
  externalIds: {
    ravensburger: "1740993c2d9c41b47477e050c6664ad461d7aa89",
  },
  franchise: "Winnie the Pooh",
  id: "6g9",
  inkType: ["amber"],
  inkable: false,
  missingTests: true,
  name: "Pooh Pirate Ship",
  set: "006",
  text: "MAKE A RESCUE {E}, 3 {I} – Return a Pirate character card from your discard to your hand.",
};
