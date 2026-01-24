import type { ItemCard } from "@tcg/lorcana-types";

export const webbysDiary: ItemCard = {
  id: "1fg",
  cardType: "item",
  name: "Webby's Diary",
  inkType: ["amber"],
  franchise: "Ducktales",
  set: "010",
  text: "LATEST ENTRY Whenever you put a card under one of your characters or locations, you may pay 1 {I} to draw a card.",
  cost: 3,
  cardNumber: 31,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "052178bee287258a40a9744fdd901e4b2bd11210",
  },
  abilities: [
    {
      id: "1fg-1",
      type: "triggered",
      name: "LATEST ENTRY",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
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
      text: "LATEST ENTRY Whenever you put a card under one of your characters or locations, you may pay 1 {I} to draw a card.",
    },
  ],
};
