import type { ItemCard } from "@tcg/lorcana-types";

export const robinsBow: ItemCard = {
  id: "1mp",
  cardType: "item",
  name: "Robin's Bow",
  inkType: ["emerald"],
  franchise: "Robin Hood",
  set: "003",
  text: "FOREST'S GIFT {E} — Deal 1 damage to chosen damaged character or location.\nA BIT OF A LARK Whenever a character of yours named Robin Hood quests, you may ready this item.",
  cost: 3,
  cardNumber: 98,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "d293219ed77258962e7cd9f44130df06bf95e5f6",
  },
  abilities: [
    {
      id: "1mp-1",
      type: "activated",
      cost: { exert: true },
      effect: {
        type: "deal-damage",
        amount: 1,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "FOREST'S GIFT {E} — Deal 1 damage to chosen damaged character or location.",
    },
    {
      id: "1mp-2",
      type: "triggered",
      name: "A BIT OF A LARK",
      trigger: { event: "play", timing: "when", on: "SELF" },
      effect: {
        type: "optional",
        effect: {
          type: "ready",
          target: {
            selector: "self",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["item"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "A BIT OF A LARK Whenever a character of yours named Robin Hood quests, you may ready this item.",
    },
  ],
};
