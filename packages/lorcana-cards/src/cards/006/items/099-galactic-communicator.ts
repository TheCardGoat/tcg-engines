import type { ItemCard } from "@tcg/lorcana-types";

export const galacticCommunicator: ItemCard = {
  abilities: [
    {
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
      id: "q1z-1",
      text: "RESOURCE ALLOCATION 1 {I}, Banish this item - Return chosen character with 2 {S} or less to their player's hand.",
      type: "action",
    },
  ],
  cardNumber: 99,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "5de77ec98209b02711da467966a414e2894f860a",
  },
  franchise: "Lilo and Stitch",
  id: "q1z",
  inkType: ["emerald"],
  inkable: false,
  missingTests: true,
  name: "Galactic Communicator",
  set: "006",
  text: "RESOURCE ALLOCATION 1 {I}, Banish this item - Return chosen character with 2 {S} or less to their player's hand.",
};
