import type { ItemCard } from "@tcg/lorcana-types";

export const heartOfAtlantis: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        from: "hand",
        type: "play-card",
      },
      id: "zzp-1",
      text: "LIFE GIVER {E} — You pay 2 {I} less for the next character you play this turn.",
      type: "activated",
    },
  ],
  cardNumber: 30,
  cardType: "item",
  cost: 4,
  externalIds: {
    ravensburger: "81b7a4a7ddb1986db77cd54d3e3e40d0154f0a29",
  },
  franchise: "Atlantis",
  id: "zzp",
  inkType: ["amber"],
  inkable: false,
  missingTests: true,
  name: "Heart of Atlantis",
  set: "003",
  text: "LIFE GIVER {E} — You pay 2 {I} less for the next character you play this turn.",
};
