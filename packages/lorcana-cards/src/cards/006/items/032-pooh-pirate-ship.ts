import type { ItemCard } from "@tcg/lorcana-types";

export const poohPirateShip: ItemCard = {
  id: "6g9",
  cardType: "item",
  name: "Pooh Pirate Ship",
  inkType: ["amber"],
  franchise: "Winnie the Pooh",
  set: "006",
  text: "MAKE A RESCUE {E}, 3 {I} – Return a Pirate character card from your discard to your hand.",
  cost: 1,
  cardNumber: 32,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "1740993c2d9c41b47477e050c6664ad461d7aa89",
  },
  abilities: [
    {
      id: "6g9-1",
      type: "action",
      effect: {
        type: "return-from-discard",
        target: "CONTROLLER",
      },
      text: "MAKE A RESCUE {E}, 3 {I} – Return a Pirate character card from your discard to your hand.",
    },
  ],
};
