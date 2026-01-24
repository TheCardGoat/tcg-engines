import type { ActionCard } from "@tcg/lorcana-types";

export const worldsGreatestCriminalMind: ActionCard = {
  id: "5o7",
  cardType: "action",
  name: "World's Greatest Criminal Mind",
  inkType: ["amber"],
  franchise: "Great Mouse Detective",
  set: "009",
  text: "Banish chosen character with 5 {S} or more.",
  actionSubtype: "song",
  cost: 3,
  cardNumber: 30,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1471d83012de7c7df9cd43e860b8cd5eda891838",
  },
  abilities: [
    {
      id: "5o7-1",
      type: "action",
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
      text: "Banish chosen character with 5 {S} or more.",
    },
  ],
};
