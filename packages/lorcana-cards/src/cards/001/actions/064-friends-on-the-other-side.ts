import type { ActionCard } from "@tcg/lorcana-types";

export const friendsOnTheOtherSide: ActionCard = {
  abilities: [
    {
      effect: {
        amount: 2,
        target: "CONTROLLER",
        type: "draw",
      },
      id: "a41-1",
      text: "Draw 2 cards.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 64,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "248406633c5253dbfe3569d61c9feaa738ab3a84",
  },
  franchise: "Princess and the Frog",
  id: "a41",
  inkType: ["amethyst"],
  inkable: true,
  name: "Friends on the Other Side",
  set: "001",
  text: "Draw 2 cards.",
};
