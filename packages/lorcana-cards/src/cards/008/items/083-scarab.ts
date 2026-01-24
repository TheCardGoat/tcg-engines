import type { ItemCard } from "@tcg/lorcana-types";

export const scarab: ItemCard = {
  id: "1wa",
  cardType: "item",
  name: "Scarab",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "008",
  text: "SEARCH THE SANDS {E} 2 {I} – Return an Illusion character card from your discard to your hand.",
  cost: 2,
  cardNumber: 83,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "f664f18da2600606537df66ca9d9663d72b4a7b8",
  },
  abilities: [
    {
      id: "1wa-1",
      type: "action",
      effect: {
        type: "return-from-discard",
        target: "CONTROLLER",
      },
      text: "SEARCH THE SANDS {E} 2 {I} – Return an Illusion character card from your discard to your hand.",
    },
  ],
};
