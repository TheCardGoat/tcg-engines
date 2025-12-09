import type { ActionCard } from "@tcg/lorcana";

export const theHorsemanStrikes: ActionCard = {
  id: "14i",
  cardType: "action",
  name: "The Horseman Strikes!",
  inkType: ["amber"],
  franchise: "Sleepy Hollow",
  set: "010",
  text: "Draw a card. You may banish chosen character with Evasive.",
  cost: 3,
  cardNumber: 29,
  inkable: true,
  externalIds: {
    ravensburger: "90fdcaf4b9ec91e3c409fbf4ff9ebb6fc58f0cde",
  },
  abilities: [
    {
      id: "14i-1",
      text: "Draw a card. You may banish chosen character with Evasive.",
      type: "action",
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
