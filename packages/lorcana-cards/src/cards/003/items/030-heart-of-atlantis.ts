import type { ItemCard } from "@tcg/lorcana-types";

export const heartOfAtlantis: ItemCard = {
  id: "zzp",
  cardType: "item",
  name: "Heart of Atlantis",
  inkType: ["amber"],
  franchise: "Atlantis",
  set: "003",
  text: "LIFE GIVER {E} — You pay 2 {I} less for the next character you play this turn.",
  cost: 4,
  cardNumber: 30,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "81b7a4a7ddb1986db77cd54d3e3e40d0154f0a29",
  },
  abilities: [
    {
      id: "zzp-1",
      type: "activated",
      cost: { exert: true },
      effect: {
        type: "play-card",
        from: "hand",
      },
      text: "LIFE GIVER {E} — You pay 2 {I} less for the next character you play this turn.",
    },
  ],
};
