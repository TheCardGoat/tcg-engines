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
  abilities: [],
};
