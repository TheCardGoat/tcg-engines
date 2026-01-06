import type { ActionCard } from "@tcg/lorcana-types";

export const youreWelcome: ActionCard = {
  id: "1my",
  cardType: "action",
  name: "You're Welcome",
  inkType: ["emerald"],
  franchise: "Moana",
  set: "005",
  text: "Shuffle chosen character, item, or location into their player's deck. That player draws 2 cards.",
  actionSubtype: "song",
  cost: 4,
  cardNumber: 96,
  inkable: true,
  externalIds: {
    ravensburger: "d1b38a28131ef676d9daa53b83ce02ff56acc2bc",
  },
  abilities: [
    {
      id: "1my-1",
      type: "action",
      effect: {
        type: "draw",
        amount: 2,
        target: "CONTROLLER",
      },
      text: "Shuffle chosen character, item, or location into their player's deck. That player draws 2 cards.",
    },
  ],
};
