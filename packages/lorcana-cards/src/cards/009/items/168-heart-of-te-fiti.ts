import type { ItemCard } from "@tcg/lorcana-types";

export const heartOfTeFiti: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        exerted: true,
        facedown: true,
        source: "top-of-deck",
        target: "CONTROLLER",
        type: "put-into-inkwell",
      },
      id: "1vi-1",
      text: "CREATE LIFE {E}, 2 {I} — Put the top card of your deck into your inkwell facedown and exerted.",
      type: "activated",
    },
  ],
  cardNumber: 168,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "f2d37b460b9e74070319ab78f31a81246eb7f444",
  },
  franchise: "Moana",
  id: "1vi",
  inkType: ["sapphire"],
  inkable: true,
  missingTests: true,
  name: "Heart of Te Fiti",
  set: "009",
  text: "CREATE LIFE {E}, 2 {I} — Put the top card of your deck into your inkwell facedown and exerted.",
};
