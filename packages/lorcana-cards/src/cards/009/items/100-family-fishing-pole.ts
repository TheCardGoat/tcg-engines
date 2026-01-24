import type { ItemCard } from "@tcg/lorcana-types";

export const familyFishingPole: ItemCard = {
  id: "xac",
  cardType: "item",
  name: "Family Fishing Pole",
  inkType: ["emerald"],
  franchise: "Goofy Movie",
  set: "009",
  text: "WATCH CLOSELY This item enters play exerted.\nTHE PERFECT CAST {E}, 1 {I}, Banish this item – Return chosen exerted character of yours to your hand to gain 2 lore.",
  cost: 2,
  cardNumber: 100,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "77f89661be484a477c94272ef31e4696926a7f36",
  },
  abilities: [
    {
      id: "xac-1",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "enters-play-exerted",
        target: "SELF",
      },
      name: "WATCH CLOSELY",
      text: "WATCH CLOSELY This item enters play exerted.",
    },
    {
      id: "xac-2",
      type: "action",
      effect: {
        type: "gain-lore",
        amount: 2,
      },
      text: "THE PERFECT CAST {E}, 1 {I}, Banish this item – Return chosen exerted character of yours to your hand to gain 2 lore.",
    },
  ],
};
