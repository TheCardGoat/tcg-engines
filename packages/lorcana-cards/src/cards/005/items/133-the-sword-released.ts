import type { ItemCard } from "@tcg/lorcana-types";

export const theSwordReleased: ItemCard = {
  abilities: [
    {
      effect: {
        condition: {
          type: "if",
          expression:
            "you have a character in play with more {S} than each opposing character in play",
        },
        then: {
          type: "lose-lore",
          amount: 1,
          target: "EACH_OPPONENT",
        },
        type: "conditional",
      },
      id: "fy1-1",
      text: "POWER APPOINTED At the start of your turn, if you have a character in play with more {S} than each opposing character in play, each opponent loses 1 lore and you gain lore equal to the lore lost.",
      type: "action",
    },
  ],
  cardNumber: 133,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "3978188633160fe7db7bc875815de9594fe4e400",
  },
  franchise: "Sword in the Stone",
  id: "fy1",
  inkType: ["ruby"],
  inkable: false,
  missingTests: true,
  name: "The Sword Released",
  set: "005",
  text: "POWER APPOINTED At the start of your turn, if you have a character in play with more {S} than each opposing character in play, each opponent loses 1 lore and you gain lore equal to the lore lost.",
};
