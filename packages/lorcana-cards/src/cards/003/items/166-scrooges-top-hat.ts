import type { ItemCard } from "@tcg/lorcana-types";

export const scroogesTopHat: ItemCard = {
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        type: "cost-reduction",
        amount: 1,
        cardType: "item",
        duration: "next-play-this-turn",
      },
      id: "1mq-1",
      name: "BUSINESS EXPERTISE",
      text: "BUSINESS EXPERTISE {E} — You pay 1 {I} less for the next item you play this turn.",
      type: "activated",
    },
  ],
  cardNumber: 166,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "d177a0148325ee5b7747b7c3d15a8ae2d03ff961",
  },
  franchise: "Ducktales",
  id: "1mq",
  inkType: ["sapphire"],
  inkable: false,
  name: "Scrooge's Top Hat",
  set: "003",
  text: "BUSINESS EXPERTISE {E} — You pay 1 {I} less for the next item you play this turn.",
};
