import type { ItemCard } from "@tcg/lorcana-types";

export const princeJohnsMirror: ItemCard = {
  abilities: [
    {
      condition: {
        controller: "you",
        name: "Prince John",
        type: "has-named-character",
      },
      effect: {
        amount: 3,
        cardType: "item",
        type: "cost-reduction",
      },
      id: "fzx-1",
      name: "YOU LOOK REGAL",
      text: "YOU LOOK REGAL If you have a character named Prince John in play, you pay 1 {I} less to play this item.",
      type: "static",
    },
    {
      condition: {
        comparison: "greater-than",
        controller: "opponent",
        type: "resource-count",
        value: 0,
        what: "cards-in-hand",
      },
      effect: {
        amount: 0,
        chosen: true,
        target: "OPPONENT",
        type: "discard",
      },
      id: "fzx-2",
      name: "A FEELING OF POWER",
      text: "A FEELING OF POWER At the end of each opponent's turn, if they have more than 3 cards in their hand, they discard until they have {d} cards in their hand.",
      trigger: {
        event: "end-turn",
        on: "OPPONENT",
        timing: "at",
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
