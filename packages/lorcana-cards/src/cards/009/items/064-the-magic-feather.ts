import type { ItemCard } from "@tcg/lorcana-types";

export const theMagicFeather: ItemCard = {
  id: "cfx",
  cardType: "item",
  name: "The Magic Feather",
  inkType: ["amethyst"],
  franchise: "Dumbo",
  set: "009",
  text: "NOW YOU CAN FLY! When you play this item, choose a character of yours. While this item is in play, that character gains Evasive. (Only characters with Evasive can challenge them.)\nGROUNDED 3 {I} — Return this item to your hand.",
  cost: 2,
  cardNumber: 64,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2cd7f5750cf7213ca57bfd25757bf2c0c01548d6",
  },
  abilities: [
    {
      id: "cfx-1",
      type: "triggered",
      name: "NOW YOU CAN FLY!",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
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
      text: "NOW YOU CAN FLY! When you play this item, choose a character of yours. While this item is in play, that character gains Evasive.",
    },
    {
      id: "cfx-2",
      type: "activated",
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
      text: "GROUNDED 3 {I} — Return this item to your hand.",
    },
  ],
};
