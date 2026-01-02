import type { ActionCard } from "@tcg/lorcana-types";

export const fanTheFlames: ActionCard = {
  id: "1eo",
  cardType: "action",
  name: "Fan the Flames",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "001",
  text: "Ready chosen character. They can't quest for the rest of this turn.",
  cost: 1,
  cardNumber: 131,
  inkable: true,
  externalIds: {
    ravensburger: "b6ae49eb443bf7dcdbb8754463b0144b3c7c183e",
  },
  abilities: [
    {
      id: "1eo-1",
      text: "Ready chosen character. They can't quest for the rest of this turn.",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "cant-quest",
        target: "SELF",
      },
    },
  ],
};
