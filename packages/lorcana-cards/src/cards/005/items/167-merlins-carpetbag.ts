import type { ItemCard } from "@tcg/lorcana-types";

export const merlinsCarpetbag: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        type: "return-from-discard",
        target: "CONTROLLER",
        cardType: "item",
      },
      id: "1ya-1",
      text: "HOCKETY POCKETY {E}, 1 {I} — Return an item card from your discard to your hand.",
      type: "activated",
    },
  ],
  cardNumber: 167,
  cardType: "item",
  cost: 5,
  externalIds: {
    ravensburger: "ffc4e3a63293eb9cdd1008929f04b9fad112083f",
  },
  franchise: "Sword in the Stone",
  id: "1ya",
  inkType: ["sapphire"],
  inkable: false,
  missingTests: true,
  name: "Merlin's Carpetbag",
  set: "005",
  text: "HOCKETY POCKETY {E}, 1 {I} — Return an item card from your discard to your hand.",
};
