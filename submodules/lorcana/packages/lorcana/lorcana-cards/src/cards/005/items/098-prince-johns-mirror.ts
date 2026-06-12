import type { ItemCard } from "@tcg/lorcana-types";
import { princeJohnsMirrorI18n } from "./098-prince-johns-mirror.i18n";

export const princeJohnsMirror: ItemCard = {
  id: "x5l",
  canonicalId: "ci_x5l",
  reprints: ["set5-098"],
  cardType: "item",
  name: "Prince John's Mirror",
  inkType: ["emerald"],
  franchise: "Robin Hood",
  set: "005",
  cardNumber: 98,
  rarity: "rare",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_e37301dbd08d47fcbd95accf72aa2a3c",
    tcgPlayer: 561299,
  },
  text: [
    {
      title: "YOU LOOK REGAL",
      description:
        "If you have a character named Prince John in play, you pay 1 {I} less to play this item.",
    },
    {
      title: "A FEELING OF POWER",
      description:
        "At the end of each opponent's turn, if they have more than 3 cards in their hand, they discard until they have 3 cards in their hand.",
    },
  ],
  abilities: [
    {
      id: "fzx-1",
      text: "YOU LOOK REGAL If you have a character named Prince John in play, you pay 1 {I} less to play this item.",
      name: "YOU LOOK REGAL",
      condition: {
        controller: "you",
        name: "Prince John",
        type: "has-named-character",
      },
      effect: {
        type: "cost-reduction",
        amount: 1,
        cardType: "item",
      },
      type: "static",
    },
    {
      id: "fzx-2",
      text: "A FEELING OF POWER At the end of each opponent's turn, if they have more than 3 cards in their hand, they discard until they have 3 cards in their hand.",
      name: "A FEELING OF POWER",
      condition: {
        comparison: "greater-than",
        controller: "opponent",
        type: "resource-count",
        value: 3,
        what: "cards-in-hand",
      },
      effect: {
        type: "discard",
        amount: {
          type: "difference",
          left: {
            type: "cards-in-hand",
            controller: "opponent",
          },
          right: 3,
        },
        target: "OPPONENT",
        chosen: true,
        from: "hand",
      },
      trigger: {
        event: "end-turn",
        on: "OPPONENT",
        timing: "at",
      },
      type: "triggered",
    },
  ],
  i18n: princeJohnsMirrorI18n,
};
