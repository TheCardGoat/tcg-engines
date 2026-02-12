import type { ItemCard } from "@tcg/lorcana-types";

export const familyFishingPole: ItemCard = {
  abilities: [
    {
      effect: {
        restriction: "enters-play-exerted",
        target: "SELF",
        type: "restriction",
      },
      id: "xac-1",
      name: "WATCH CLOSELY",
      text: "WATCH CLOSELY This item enters play exerted.",
      type: "static",
    },
    {
      effect: {
        amount: 2,
        type: "gain-lore",
      },
      id: "xac-2",
      text: "THE PERFECT CAST {E}, 1 {I}, Banish this item – Return chosen exerted character of yours to your hand to gain 2 lore.",
      type: "action",
    },
  ],
  cardNumber: 100,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "77f89661be484a477c94272ef31e4696926a7f36",
  },
  franchise: "Goofy Movie",
  id: "xac",
  inkType: ["emerald"],
  inkable: true,
  missingTests: true,
  name: "Family Fishing Pole",
  set: "009",
  text: "WATCH CLOSELY This item enters play exerted.\nTHE PERFECT CAST {E}, 1 {I}, Banish this item – Return chosen exerted character of yours to your hand to gain 2 lore.",
};
