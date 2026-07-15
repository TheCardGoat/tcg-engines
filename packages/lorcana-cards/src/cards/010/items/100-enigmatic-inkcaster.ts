import type { ItemCard } from "@tcg/lorcana-types";

export const enigmaticInkcaster: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        condition: {
          expression: "you've played 2 or more cards this turn",
          type: "if",
        },
        then: {
          amount: 1,
          type: "gain-lore",
        },
        type: "conditional",
      },
      id: "pr8-1",
      text: "ITS OWN REWARD {E} — If you've played 2 or more cards this turn, gain 1 lore.",
      type: "activated",
    },
  ],
  cardNumber: 100,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "5cd409752d10d79e8a7c33b9a22eb0f82c1850a3",
  },
  franchise: "Lorcana",
  id: "pr8",
  inkType: ["emerald"],
  inkable: false,
  missingTests: true,
  name: "Enigmatic Inkcaster",
  set: "010",
  text: "ITS OWN REWARD {E} — If you've played 2 or more cards this turn, gain 1 lore.",
};
