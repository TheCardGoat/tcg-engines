import type { ItemCard } from "@tcg/lorcana-types";

export const longboat: ItemCard = {
  id: "1wi",
  cardType: "item",
  name: "Longboat",
  inkType: ["ruby"],
  franchise: "Treasure Planet",
  set: "006",
  text: "TAKE IT FOR A SPIN 2 {I} – Chosen character of yours gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)",
  cost: 2,
  cardNumber: 132,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "f693d84734a618efa3cb5486f95d6154fcc2bc3d",
  },
  abilities: [
    {
      id: "1wi-1",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "TAKE IT FOR A SPIN 2 {I} – Chosen character of yours gains Evasive until the start of your next turn.",
    },
  ],
};
