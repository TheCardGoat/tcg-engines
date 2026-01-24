import type { ItemCard } from "@tcg/lorcana-types";

export const emeraldChromicon: ItemCard = {
  id: "1sl",
  cardType: "item",
  name: "Emerald Chromicon",
  inkType: ["emerald"],
  franchise: "Lorcana",
  set: "005",
  text: "EMERALD LIGHT During opponents' turns, whenever one of your characters is banished, you may return chosen character to their player's hand.",
  cost: 3,
  cardNumber: 100,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "e8d2c7ee84a66e7cf0184644c8a27abafeef32a3",
  },
  abilities: [
    {
      id: "1sl-1",
      type: "action",
      effect: {
        type: "optional",
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
        chooser: "CONTROLLER",
      },
      text: "EMERALD LIGHT During opponents' turns, whenever one of your characters is banished, you may return chosen character to their player's hand.",
    },
  ],
};
