import type { ItemCard } from "@tcg/lorcana-types";

export const miracleCandle: ItemCard = {
  id: "1cb",
  cardType: "item",
  name: "Miracle Candle",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "004",
  text: "ABUELA'S GIFT Banish this item — If you have 3 or more characters in play, gain 2 lore and remove up to 2 damage from chosen location.",
  cost: 2,
  cardNumber: 31,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "addabf289c8cbbf0b7d668c5d4e4e65e118fa61e",
  },
  abilities: [
    {
      id: "1cb-1",
      type: "activated",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have 3 or more characters in play",
        },
        then: {
          type: "remove-damage",
          amount: 2,
          upTo: true,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["location"],
          },
        },
      },
      text: "ABUELA'S GIFT Banish this item — If you have 3 or more characters in play, gain 2 lore and remove up to 2 damage from chosen location.",
    },
  ],
};
