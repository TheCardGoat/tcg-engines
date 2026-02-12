import type { ActionCard } from "@tcg/lorcana-types";

export const royalTantrum: ActionCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            target: {
              cardTypes: ["item"],
              count: "all",
              owner: "you",
              selector: "all",
              zones: ["play"],
            },
            type: "banish",
          },
          {
            counter: {
              controller: "you",
              type: "items",
            },
            effect: {
              amount: 1,
              target: "CONTROLLER",
              type: "draw",
            },
            type: "for-each",
          },
        ],
        type: "sequence",
      },
      id: "96v-1",
      text: "Banish any number of your items, then draw a card for each item banished this way.",
      type: "action",
    },
  ],
  cardNumber: 161,
  cardType: "action",
  cost: 4,
  externalIds: {
    ravensburger: "211fa6f2c714f9c7c38c603759096a5a87b2f7c3",
  },
  franchise: "Robin Hood",
  id: "96v",
  inkType: ["sapphire"],
  inkable: false,
  missingTests: true,
  name: "Royal Tantrum",
  set: "005",
  text: "Banish any number of your items, then draw a card for each item banished this way.",
};
