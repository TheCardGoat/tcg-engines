import type { ItemCard } from "@tcg/lorcana-types";

export const miracleCandle: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        condition: {
          expression: "you have 3 or more characters in play",
          type: "if",
        },
        then: {
          amount: 2,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["location"],
          },
          type: "remove-damage",
          upTo: true,
        },
        type: "conditional",
      },
      id: "1cb-1",
      text: "ABUELA'S GIFT Banish this item — If you have 3 or more characters in play, gain 2 lore and remove up to 2 damage from chosen location.",
      type: "activated",
    },
  ],
  cardNumber: 31,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "addabf289c8cbbf0b7d668c5d4e4e65e118fa61e",
  },
  franchise: "Encanto",
  id: "1cb",
  inkType: ["amber"],
  inkable: true,
  missingTests: true,
  name: "Miracle Candle",
  set: "004",
  text: "ABUELA'S GIFT Banish this item — If you have 3 or more characters in play, gain 2 lore and remove up to 2 damage from chosen location.",
};
