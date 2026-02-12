import type { ItemCard } from "@tcg/lorcana-types";

export const emeraldChromicon: ItemCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "return-to-hand",
        },
        type: "optional",
      },
      id: "1sl-1",
      text: "EMERALD LIGHT During opponents' turns, whenever one of your characters is banished, you may return chosen character to their player's hand.",
      type: "action",
    },
  ],
  cardNumber: 100,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "e8d2c7ee84a66e7cf0184644c8a27abafeef32a3",
  },
  franchise: "Lorcana",
  id: "1sl",
  inkType: ["emerald"],
  inkable: false,
  missingTests: true,
  name: "Emerald Chromicon",
  set: "005",
  text: "EMERALD LIGHT During opponents' turns, whenever one of your characters is banished, you may return chosen character to their player's hand.",
};
