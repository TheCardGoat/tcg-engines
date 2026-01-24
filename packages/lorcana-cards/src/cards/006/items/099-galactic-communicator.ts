import type { ItemCard } from "@tcg/lorcana-types";

export const galacticCommunicator: ItemCard = {
  id: "q1z",
  cardType: "item",
  name: "Galactic Communicator",
  inkType: ["emerald"],
  franchise: "Lilo and Stitch",
  set: "006",
  text: "RESOURCE ALLOCATION 1 {I}, Banish this item - Return chosen character with 2 {S} or less to their player's hand.",
  cost: 2,
  cardNumber: 99,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "5de77ec98209b02711da467966a414e2894f860a",
  },
  abilities: [
    {
      id: "q1z-1",
      type: "action",
      effect: {
        type: "return-to-hand",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "RESOURCE ALLOCATION 1 {I}, Banish this item - Return chosen character with 2 {S} or less to their player's hand.",
    },
  ],
};
