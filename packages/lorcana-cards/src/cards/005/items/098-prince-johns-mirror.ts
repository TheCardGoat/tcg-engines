import type { ItemCard } from "@tcg/lorcana-types";

export const princeJohnsMirror: ItemCard = {
  abilities: [
    {
      condition: {
        type: "has-named-character",
        name: "Prince John",
        controller: "you",
      },
      effect: {
        type: "cost-reduction",
        amount: 3,
        cardType: "item",
      },
      id: "fzx-1",
      name: "YOU LOOK REGAL",
      text: "YOU LOOK REGAL If you have a character named Prince John in play, you pay 1 {I} less to play this item.",
      type: "static",
    },
    {
      condition: {
        type: "resource-count",
        what: "cards-in-hand",
        controller: "opponent",
        comparison: "greater-than",
        value: 0,
      },
      effect: {
        type: "discard",
        amount: 0,
        target: "OPPONENT",
        chosen: true,
      },
      id: "fzx-2",
      name: "A FEELING OF POWER",
      text: "A FEELING OF POWER At the end of each opponent's turn, if they have more than 3 cards in their hand, they discard until they have {d} cards in their hand.",
      trigger: {
        event: "end-turn",
        timing: "at",
        on: "OPPONENT",
      },
      type: "triggered",
    },
  ],
  cardNumber: 98,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "39a89923e71c7d7870de8d7f8c51bad51dc4f138",
  },
  franchise: "Robin Hood",
  id: "fzx",
  inkType: ["emerald"],
  inkable: true,
  name: "Prince John's Mirror",
  set: "005",
  text: "YOU LOOK REGAL If you have a character named Prince John in play, you pay 1 {I} less to play this item.\nA FEELING OF POWER At the end of each opponent's turn, if they have more than 3 cards in their hand, they discard until they have 3 cards in their hand.",
};
