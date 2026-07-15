import type { ItemCard } from "@tcg/lorcana-types";

export const hiddenInkcaster: ItemCard = {
  abilities: [
    {
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      id: "164-1",
      name: "FRESH INK",
      text: "FRESH INK When you play this item, draw a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 98,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "9a55893ec9534cdf491712143ca14b5696e02b1f",
  },
  franchise: "Lorcana",
  id: "164",
  inkType: ["emerald"],
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  name: "Hidden Inkcaster",
  set: "004",
  text: "FRESH INK When you play this item, draw a card.\nUNEXPECTED TREASURE All cards in your hand count as having {IW}.",
};
