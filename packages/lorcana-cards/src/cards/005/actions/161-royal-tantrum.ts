import type { ActionCard } from "@tcg/lorcana-types";

export const royalTantrum: ActionCard = {
  id: "96v",
  cardType: "action",
  name: "Royal Tantrum",
  inkType: ["sapphire"],
  franchise: "Robin Hood",
  set: "005",
  text: "Banish any number of your items, then draw a card for each item banished this way.",
  cost: 4,
  cardNumber: 161,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "211fa6f2c714f9c7c38c603759096a5a87b2f7c3",
  },
  abilities: [
    {
      id: "96v-1",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "banish",
            target: {
              selector: "all",
              count: "all",
              owner: "you",
              zones: ["play"],
              cardTypes: ["item"],
            },
          },
          {
            type: "for-each",
            counter: {
              type: "items",
              controller: "you",
            },
            effect: {
              type: "draw",
              amount: 1,
              target: "CONTROLLER",
            },
          },
        ],
      },
      text: "Banish any number of your items, then draw a card for each item banished this way.",
    },
  ],
};
