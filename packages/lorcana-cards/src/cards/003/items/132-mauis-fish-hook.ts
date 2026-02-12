import type { ItemCard } from "@tcg/lorcana-types";

export const mauisFishHook: ItemCard = {
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
      id: "1bn-3",
      text: "• Chosen character gains Evasive until the start of your next turn.",
      type: "action",
    },
    {
      effect: {
        duration: "this-turn",
        modifier: 3,
        stat: "strength",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "modify-stat",
      },
      id: "1bn-4",
      text: "• Chosen character gets +3 {S} this turn.",
      type: "action",
    },
  ],
  cardNumber: 132,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "a9e7ec404bfc922091cf146ebf47177ce8ea39db",
  },
  franchise: "Moana",
  id: "1bn",
  inkType: ["ruby"],
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  name: "Maui's Fish Hook",
  set: "003",
  text: "IT'S MAUI TIME! If you have a character named Maui in play, you may use this item's Shapeshift ability for free.\nSHAPESHIFT {E}, 2 {I} — Choose one:\n• Chosen character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)\n• Chosen character gets +3 {S} this turn.",
};
