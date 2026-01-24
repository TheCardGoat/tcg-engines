import type { ItemCard } from "@tcg/lorcana-types";

export const merlinsCarpetbag: ItemCard = {
  id: "1ya",
  cardType: "item",
  name: "Merlin's Carpetbag",
  inkType: ["sapphire"],
  franchise: "Sword in the Stone",
  set: "005",
  text: "HOCKETY POCKETY {E}, 1 {I} — Return an item card from your discard to your hand.",
  cost: 5,
  cardNumber: 167,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "ffc4e3a63293eb9cdd1008929f04b9fad112083f",
  },
  abilities: [
    {
      id: "1ya-1",
      type: "activated",
      effect: {
        type: "return-from-discard",
        target: "CONTROLLER",
        cardType: "item",
      },
      text: "HOCKETY POCKETY {E}, 1 {I} — Return an item card from your discard to your hand.",
    },
  ],
};
