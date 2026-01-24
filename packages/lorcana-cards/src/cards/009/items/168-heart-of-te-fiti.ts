import type { ItemCard } from "@tcg/lorcana-types";

export const heartOfTeFiti: ItemCard = {
  id: "1vi",
  cardType: "item",
  name: "Heart of Te Fiti",
  inkType: ["sapphire"],
  franchise: "Moana",
  set: "009",
  text: "CREATE LIFE {E}, 2 {I} — Put the top card of your deck into your inkwell facedown and exerted.",
  cost: 3,
  cardNumber: 168,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f2d37b460b9e74070319ab78f31a81246eb7f444",
  },
  abilities: [
    {
      id: "1vi-1",
      type: "activated",
      effect: {
        type: "put-into-inkwell",
        source: "top-of-deck",
        target: "CONTROLLER",
        exerted: true,
        facedown: true,
      },
      text: "CREATE LIFE {E}, 2 {I} — Put the top card of your deck into your inkwell facedown and exerted.",
    },
  ],
};
