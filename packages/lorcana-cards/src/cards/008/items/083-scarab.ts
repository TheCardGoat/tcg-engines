import type { ItemCard } from "@tcg/lorcana-types";

export const scarab: ItemCard = {
  abilities: [
    {
      effect: {
        type: "return-from-discard",
        target: "CONTROLLER",
      },
      id: "1wa-1",
      text: "SEARCH THE SANDS {E} 2 {I} – Return an Illusion character card from your discard to your hand.",
      type: "action",
    },
  ],
  cardNumber: 83,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "f664f18da2600606537df66ca9d9663d72b4a7b8",
  },
  franchise: "Aladdin",
  id: "1wa",
  inkType: ["amethyst"],
  inkable: false,
  missingTests: true,
  name: "Scarab",
  set: "008",
  text: "SEARCH THE SANDS {E} 2 {I} – Return an Illusion character card from your discard to your hand.",
};
