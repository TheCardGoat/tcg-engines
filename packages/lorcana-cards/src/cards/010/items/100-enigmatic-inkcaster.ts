import type { ItemCard } from "@tcg/lorcana-types";

export const enigmaticInkcaster: ItemCard = {
  id: "pr8",
  cardType: "item",
  name: "Enigmatic Inkcaster",
  inkType: ["emerald"],
  franchise: "Lorcana",
  set: "010",
  text: "ITS OWN REWARD {E} — If you've played 2 or more cards this turn, gain 1 lore.",
  cost: 2,
  cardNumber: 100,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "5cd409752d10d79e8a7c33b9a22eb0f82c1850a3",
  },
  abilities: [
    {
      id: "pr8-1",
      type: "activated",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you've played 2 or more cards this turn",
        },
        then: {
          type: "gain-lore",
          amount: 1,
        },
      },
      text: "ITS OWN REWARD {E} — If you've played 2 or more cards this turn, gain 1 lore.",
    },
  ],
};
