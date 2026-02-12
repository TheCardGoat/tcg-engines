import type { ActionCard } from "@tcg/lorcana-types";

export const theHorsemanStrikes: ActionCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "banish",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        type: "optional",
      },
      id: "14i-1",
      text: "Draw a card. You may banish chosen character with Evasive.",
      type: "action",
    },
  ],
  cardNumber: 29,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "90fdcaf4b9ec91e3c409fbf4ff9ebb6fc58f0cde",
  },
  franchise: "Sleepy Hollow",
  id: "14i",
  inkType: ["amber"],
  inkable: true,
  missingTests: true,
  name: "The Horseman Strikes!",
  set: "010",
  text: "Draw a card. You may banish chosen character with Evasive.",
};
