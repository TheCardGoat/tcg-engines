import type { ItemCard } from "@tcg/lorcana-types";

export const princeJohnsMirror: ItemCard = {
  id: "fzx",
  cardType: "item",
  name: "Prince John's Mirror",
  inkType: ["emerald"],
  franchise: "Robin Hood",
  set: "005",
  text: "YOU LOOK REGAL If you have a character named Prince John in play, you pay 1 {I} less to play this item.\nA FEELING OF POWER At the end of each opponent's turn, if they have more than 3 cards in their hand, they discard until they have 3 cards in their hand.",
  cost: 3,
  cardNumber: 98,
  inkable: true,
  externalIds: {
    ravensburger: "39a89923e71c7d7870de8d7f8c51bad51dc4f138",
  },
  abilities: [
    {
      id: "fzx-1",
      text: "YOU LOOK REGAL If you have a character named Prince John in play, you pay 1 {I} less to play this item.",
      name: "YOU LOOK REGAL",
      type: "static",
      effect: {
        type: "cost-reduction",
        amount: 3,
        cardType: "item",
      },
      condition: {
        type: "has-named-character",
        name: "Prince John",
        controller: "you",
      },
    },
    {
      id: "fzx-2",
      text: "A FEELING OF POWER At the end of each opponent's turn, if they have more than 3 cards in their hand, they discard until they have {d} cards in their hand.",
      name: "A FEELING OF POWER",
      type: "triggered",
      trigger: {
        event: "end-turn",
        timing: "at",
        on: "OPPONENT",
      },
      effect: {
        type: "discard",
        amount: 0,
        target: "OPPONENT",
        chosen: true,
      },
      condition: {
        type: "resource-count",
        what: "cards-in-hand",
        controller: "opponent",
        comparison: "greater-than",
        value: 0,
      },
    },
  ],
};
