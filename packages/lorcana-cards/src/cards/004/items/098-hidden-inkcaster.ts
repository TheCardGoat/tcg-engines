import type { ItemCard } from "@tcg/lorcana-types";

export const hiddenInkcaster: ItemCard = {
  id: "164",
  cardType: "item",
  name: "Hidden Inkcaster",
  inkType: ["emerald"],
  franchise: "Lorcana",
  set: "004",
  text: "FRESH INK When you play this item, draw a card.\nUNEXPECTED TREASURE All cards in your hand count as having {IW}.",
  cost: 2,
  cardNumber: 98,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9a55893ec9534cdf491712143ca14b5696e02b1f",
  },
  abilities: [
    {
      id: "164-1",
      type: "triggered",
      name: "FRESH INK",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
      text: "FRESH INK When you play this item, draw a card.",
    },
  ],
};
