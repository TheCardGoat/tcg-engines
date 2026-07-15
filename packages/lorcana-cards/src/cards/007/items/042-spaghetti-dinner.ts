import type { ItemCard } from "@tcg/lorcana-types";

export const spaghettiDinner: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        condition: {
          expression: "you have 2 or more characters in play",
          type: "if",
        },
        then: {
          amount: 1,
          type: "gain-lore",
        },
        type: "conditional",
      },
      id: "1bi-1",
      text: "FINE DINING {E}, 1 {I} — If you have 2 or more characters in play, gain 1 lore.",
      type: "activated",
    },
  ],
  cardNumber: 42,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "a9a9ca2c6a1c80726daf8f1358630264d440c24b",
  },
  franchise: "Lady and the Tramp",
  id: "1bi",
  inkType: ["amber"],
  inkable: false,
  missingTests: true,
  name: "Spaghetti Dinner",
  set: "007",
  text: "FINE DINING {E}, 1 {I} — If you have 2 or more characters in play, gain 1 lore.",
};
