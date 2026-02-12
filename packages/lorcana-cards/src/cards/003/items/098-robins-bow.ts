import type { ItemCard } from "@tcg/lorcana-types";

export const robinsBow: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        amount: 1,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "deal-damage",
      },
      id: "1mp-1",
      text: "FOREST'S GIFT {E} — Deal 1 damage to chosen damaged character or location.",
      type: "activated",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            cardTypes: ["item"],
            count: 1,
            owner: "any",
            selector: "self",
            zones: ["play"],
          },
          type: "ready",
        },
        type: "optional",
      },
      id: "1mp-2",
      name: "A BIT OF A LARK",
      text: "A BIT OF A LARK Whenever a character of yours named Robin Hood quests, you may ready this item.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 98,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "d293219ed77258962e7cd9f44130df06bf95e5f6",
  },
  franchise: "Robin Hood",
  id: "1mp",
  inkType: ["emerald"],
  inkable: false,
  missingTests: true,
  name: "Robin's Bow",
  set: "003",
  text: "FOREST'S GIFT {E} — Deal 1 damage to chosen damaged character or location.\nA BIT OF A LARK Whenever a character of yours named Robin Hood quests, you may ready this item.",
};
