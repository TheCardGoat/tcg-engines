import type { ItemCard } from "@tcg/lorcana-types";

export const unconventionalTool: ItemCard = {
  id: "qyw",
  cardType: "item",
  name: "Unconventional Tool",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "007",
  text: "FIXED IN NO TIME When this item is banished, you pay 2 {I} less for the next item you play this turn.",
  cost: 1,
  cardNumber: 150,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6132d37f5c0ee1b84d2dc393df229f24f13c9cc6",
  },
  abilities: [
    {
      id: "qyw-1",
      type: "triggered",
      name: "FIXED IN NO TIME",
      trigger: { event: "play", timing: "when", on: "SELF" },
      effect: {
        type: "play-card",
        from: "hand",
      },
      text: "FIXED IN NO TIME When this item is banished, you pay 2 {I} less for the next item you play this turn.",
    },
  ],
};
