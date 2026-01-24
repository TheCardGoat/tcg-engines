import type { ActionCard } from "@tcg/lorcana-types";

export const circleOfLife: ActionCard = {
  id: "1bo",
  cardType: "action",
  name: "Circle of Life",
  inkType: ["amber"],
  franchise: "Lion King",
  set: "009",
  text: "Sing Together 8 Play a character from your discard for free.",
  actionSubtype: "song",
  cost: 8,
  cardNumber: 26,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "aa0a28cbf35abf2cf2485c2a6780cf51d732a51e",
  },
  abilities: [
    {
      id: "1bo-1",
      type: "action",
      effect: {
        type: "play-card",
        from: "discard",
        cardType: "character",
        cost: "free",
      },
      text: "Sing Together 8 Play a character from your discard for free.",
    },
  ],
};
