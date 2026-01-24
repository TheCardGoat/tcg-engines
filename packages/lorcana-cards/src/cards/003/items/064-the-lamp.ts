import type { ItemCard } from "@tcg/lorcana-types";

export const theLamp: ItemCard = {
  id: "1ik",
  cardType: "item",
  name: "The Lamp",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "003",
  text: "GOOD OR EVIL Banish this item — If you have a character named Jafar in play, draw 2 cards. If you have a character named Genie in play, return chosen character with cost 4 or less to their player's hand.",
  cost: 2,
  cardNumber: 64,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "c3691753bf9b5b6ef060569d9c6f8fa67de42e66",
  },
  abilities: [
    {
      id: "1ik-1",
      type: "activated",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have a character named Jafar in play",
        },
        then: {
          type: "return-to-hand",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
      },
      text: "GOOD OR EVIL Banish this item — If you have a character named Jafar in play, draw 2 cards. If you have a character named Genie in play, return chosen character with cost 4 or less to their player's hand.",
    },
  ],
};
