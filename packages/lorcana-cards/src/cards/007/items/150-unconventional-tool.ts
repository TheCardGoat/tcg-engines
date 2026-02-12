import type { ItemCard } from "@tcg/lorcana-types";

export const unconventionalTool: ItemCard = {
  abilities: [
    {
      effect: {
        type: "play-card",
        from: "hand",
      },
      id: "qyw-1",
      name: "FIXED IN NO TIME",
      text: "FIXED IN NO TIME When this item is banished, you pay 2 {I} less for the next item you play this turn.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
  ],
  cardNumber: 150,
  cardType: "item",
  cost: 1,
  externalIds: {
    ravensburger: "6132d37f5c0ee1b84d2dc393df229f24f13c9cc6",
  },
  franchise: "Beauty and the Beast",
  id: "qyw",
  inkType: ["ruby"],
  inkable: true,
  missingTests: true,
  name: "Unconventional Tool",
  set: "007",
  text: "FIXED IN NO TIME When this item is banished, you pay 2 {I} less for the next item you play this turn.",
};
