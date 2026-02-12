import type { ItemCard } from "@tcg/lorcana-types";

export const longboat: ItemCard = {
  abilities: [
    {
      effect: {
        keyword: "Evasive",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "gain-keyword",
      },
      id: "1wi-1",
      text: "TAKE IT FOR A SPIN 2 {I} – Chosen character of yours gains Evasive until the start of your next turn.",
      type: "action",
    },
  ],
  cardNumber: 132,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "f693d84734a618efa3cb5486f95d6154fcc2bc3d",
  },
  franchise: "Treasure Planet",
  id: "1wi",
  inkType: ["ruby"],
  inkable: false,
  missingTests: true,
  name: "Longboat",
  set: "006",
  text: "TAKE IT FOR A SPIN 2 {I} – Chosen character of yours gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)",
};
