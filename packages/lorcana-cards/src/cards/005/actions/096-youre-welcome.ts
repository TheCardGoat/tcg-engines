import type { ActionCard } from "@tcg/lorcana-types";

export const youreWelcome: ActionCard = {
  abilities: [
    {
      effect: {
        type: "draw",
        amount: 2,
        target: "CONTROLLER",
      },
      id: "1my-1",
      text: "Shuffle chosen character, item, or location into their player's deck. That player draws 2 cards.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 96,
  cardType: "action",
  cost: 4,
  externalIds: {
    ravensburger: "d1b38a28131ef676d9daa53b83ce02ff56acc2bc",
  },
  franchise: "Moana",
  id: "1my",
  inkType: ["emerald"],
  inkable: true,
  name: "You're Welcome",
  set: "005",
  text: "Shuffle chosen character, item, or location into their player's deck. That player draws 2 cards.",
};
