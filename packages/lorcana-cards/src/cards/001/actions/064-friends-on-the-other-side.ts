import type { ActionCard } from "@tcg/lorcana-types";

export const friendsOnTheOtherSide: ActionCard = {
  id: "a41",
  cardType: "action",
  name: "Friends on the Other Side",
  inkType: ["amethyst"],
  franchise: "Princess and the Frog",
  set: "001",
  text: "Draw 2 cards.",
  actionSubtype: "song",
  cost: 3,
  cardNumber: 64,
  inkable: true,
  externalIds: {
    ravensburger: "248406633c5253dbfe3569d61c9feaa738ab3a84",
  },
  abilities: [
    {
      id: "a41-1",
      type: "action",
      effect: {
        type: "draw",
        amount: 2,
        target: "CONTROLLER",
      },
      text: "Draw 2 cards.",
    },
  ],
};
