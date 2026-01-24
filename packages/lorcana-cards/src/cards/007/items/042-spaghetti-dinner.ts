import type { ItemCard } from "@tcg/lorcana-types";

export const spaghettiDinner: ItemCard = {
  id: "1bi",
  cardType: "item",
  name: "Spaghetti Dinner",
  inkType: ["amber"],
  franchise: "Lady and the Tramp",
  set: "007",
  text: "FINE DINING {E}, 1 {I} — If you have 2 or more characters in play, gain 1 lore.",
  cost: 2,
  cardNumber: 42,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "a9a9ca2c6a1c80726daf8f1358630264d440c24b",
  },
  abilities: [
    {
      id: "1bi-1",
      type: "activated",
      cost: { exert: true },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have 2 or more characters in play",
        },
        then: {
          type: "gain-lore",
          amount: 1,
        },
      },
      text: "FINE DINING {E}, 1 {I} — If you have 2 or more characters in play, gain 1 lore.",
    },
  ],
};
