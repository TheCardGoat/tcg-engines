import type { ItemCard } from "@tcg/lorcana";

export const scroogesTopHat: ItemCard = {
  id: "1mq",
  cardType: "item",
  name: "Scrooge's Top Hat",
  inkType: ["sapphire"],
  franchise: "Ducktales",
  set: "003",
  text: "BUSINESS EXPERTISE {E} — You pay 1 {I} less for the next item you play this turn.",
  cost: 2,
  cardNumber: 166,
  inkable: false,
  externalIds: {
    ravensburger: "d177a0148325ee5b7747b7c3d15a8ae2d03ff961",
  },
  abilities: [
    {
      id: "1mq-1",
      text: "BUSINESS EXPERTISE {E} — You pay 1 {I} less for the next item you play this turn.",
      name: "BUSINESS EXPERTISE",
      type: "activated",
      cost: {
        exert: true,
      },
      effect: {
        type: "cost-reduction",
        amount: 1,
        cardType: "item",
        duration: "next-play-this-turn",
      },
    },
  ],
};
