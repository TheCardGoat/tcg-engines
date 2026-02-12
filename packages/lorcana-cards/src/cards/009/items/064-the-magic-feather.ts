import type { ItemCard } from "@tcg/lorcana-types";

export const theMagicFeather: ItemCard = {
  abilities: [
    {
      effect: {
        type: "sequence",
        steps: [
          {
            type: "play-card",
            from: "hand",
          },
          {
            type: "gain-keyword",
            keyword: "Evasive",
            target: "CHOSEN_CHARACTER",
          },
        ],
      },
      id: "cfx-1",
      name: "NOW YOU CAN FLY!",
      text: "NOW YOU CAN FLY! When you play this item, choose a character of yours. While this item is in play, that character gains Evasive.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
    {
      cost: { exert: true },
      effect: {
        type: "return-to-hand",
        target: {
          selector: "self",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["item"],
        },
      },
      id: "cfx-2",
      text: "GROUNDED 3 {I} — Return this item to your hand.",
      type: "activated",
    },
  ],
  cardNumber: 64,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "2cd7f5750cf7213ca57bfd25757bf2c0c01548d6",
  },
  franchise: "Dumbo",
  id: "cfx",
  inkType: ["amethyst"],
  inkable: true,
  missingTests: true,
  name: "The Magic Feather",
  set: "009",
  text: "NOW YOU CAN FLY! When you play this item, choose a character of yours. While this item is in play, that character gains Evasive. (Only characters with Evasive can challenge them.)\nGROUNDED 3 {I} — Return this item to your hand.",
};
