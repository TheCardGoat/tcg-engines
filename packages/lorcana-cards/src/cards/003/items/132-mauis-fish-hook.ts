import type { ItemCard } from "@tcg/lorcana-types";

export const mauisFishHook: ItemCard = {
  id: "1bn",
  cardType: "item",
  name: "Maui's Fish Hook",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "003",
  text: "IT'S MAUI TIME! If you have a character named Maui in play, you may use this item's Shapeshift ability for free.\nSHAPESHIFT {E}, 2 {I} — Choose one:\n• Chosen character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)\n• Chosen character gets +3 {S} this turn.",
  cost: 3,
  cardNumber: 132,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a9e7ec404bfc922091cf146ebf47177ce8ea39db",
  },
  abilities: [
    {
      id: "1bn-3",
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
      text: "• Chosen character gains Evasive until the start of your next turn.",
    },
    {
      id: "1bn-4",
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 3,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        duration: "this-turn",
      },
      text: "• Chosen character gets +3 {S} this turn.",
    },
  ],
};
