import type { ItemCard } from "@tcg/lorcana-types";

export const weightSet: ItemCard = {
  id: "1vv",
  cardType: "item",
  name: "Weight Set",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "002",
  text: "TRAINING Whenever you play a character with 4 or more, you may pay 1 to draw a card.",
  cost: 3,
  cardNumber: 204,
  inkable: true,
  externalIds: {
    ravensburger: "f4a817b51d3a5cca4d03b98d0eddc55294471120",
  },
  abilities: [
    {
      id: "1vv-1",
      text: "TRAINING Whenever you play a character with 4 or more, you may pay 1 to draw a card.",
      name: "TRAINING",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "character",
        },
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
};
