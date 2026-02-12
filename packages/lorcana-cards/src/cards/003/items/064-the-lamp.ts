import type { ItemCard } from "@tcg/lorcana-types";

export const theLamp: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        condition: {
          expression: "you have a character named Jafar in play",
          type: "if",
        },
        then: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "return-to-hand",
        },
        type: "conditional",
      },
      id: "1ik-1",
      text: "GOOD OR EVIL Banish this item — If you have a character named Jafar in play, draw 2 cards. If you have a character named Genie in play, return chosen character with cost 4 or less to their player's hand.",
      type: "activated",
    },
  ],
  cardNumber: 64,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "c3691753bf9b5b6ef060569d9c6f8fa67de42e66",
  },
  franchise: "Aladdin",
  id: "1ik",
  inkType: ["amethyst"],
  inkable: false,
  missingTests: true,
  name: "The Lamp",
  set: "003",
  text: "GOOD OR EVIL Banish this item — If you have a character named Jafar in play, draw 2 cards. If you have a character named Genie in play, return chosen character with cost 4 or less to their player's hand.",
};
