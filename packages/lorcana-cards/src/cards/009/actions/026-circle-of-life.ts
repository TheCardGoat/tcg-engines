import type { ActionCard } from "@tcg/lorcana-types";

export const circleOfLife: ActionCard = {
  abilities: [
    {
      effect: {
        type: "play-card",
        from: "discard",
        cardType: "character",
        cost: "free",
      },
      id: "1bo-1",
      text: "Sing Together 8 Play a character from your discard for free.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 26,
  cardType: "action",
  cost: 8,
  externalIds: {
    ravensburger: "aa0a28cbf35abf2cf2485c2a6780cf51d732a51e",
  },
  franchise: "Lion King",
  id: "1bo",
  inkType: ["amber"],
  inkable: true,
  missingTests: true,
  name: "Circle of Life",
  set: "009",
  text: "Sing Together 8 Play a character from your discard for free.",
};
