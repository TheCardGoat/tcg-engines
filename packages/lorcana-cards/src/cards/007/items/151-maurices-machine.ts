import type { ItemCard } from "@tcg/lorcana-types";

export const mauricesMachine: ItemCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "return-to-hand",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["item"],
          },
        },
        type: "optional",
      },
      id: "1fj-1",
      name: "BREAK DOWN",
      text: "BREAK DOWN When this item is banished, you may return an item card with cost 2 or less from your discard to your hand.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 151,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "051f6f7d75be055d8f35359a37f5737c6cf8907a",
  },
  franchise: "Beauty and the Beast",
  id: "1fj",
  inkType: ["ruby", "sapphire"],
  inkable: true,
  missingTests: true,
  name: "Maurice's Machine",
  set: "007",
  text: "BREAK DOWN When this item is banished, you may return an item card with cost 2 or less from your discard to your hand.",
};
