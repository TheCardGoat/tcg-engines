import type { ItemCard } from "@tcg/lorcana-types";

export const webbysDiary: ItemCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        type: "optional",
      },
      id: "1fg-1",
      name: "LATEST ENTRY",
      text: "LATEST ENTRY Whenever you put a card under one of your characters or locations, you may pay 1 {I} to draw a card.",
      trigger: {
        event: "banish",
        on: "YOUR_OTHER_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 31,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "052178bee287258a40a9744fdd901e4b2bd11210",
  },
  franchise: "Ducktales",
  id: "1fg",
  inkType: ["amber"],
  inkable: true,
  missingTests: true,
  name: "Webby's Diary",
  set: "010",
  text: "LATEST ENTRY Whenever you put a card under one of your characters or locations, you may pay 1 {I} to draw a card.",
};
