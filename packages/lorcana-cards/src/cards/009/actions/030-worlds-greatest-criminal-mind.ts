import type { ActionCard } from "@tcg/lorcana-types";

export const worldsGreatestCriminalMind: ActionCard = {
  abilities: [
    {
      effect: {
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "banish",
      },
      id: "5o7-1",
      text: "Banish chosen character with 5 {S} or more.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 30,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "1471d83012de7c7df9cd43e860b8cd5eda891838",
  },
  franchise: "Great Mouse Detective",
  id: "5o7",
  inkType: ["amber"],
  inkable: true,
  missingTests: true,
  name: "World's Greatest Criminal Mind",
  set: "009",
  text: "Banish chosen character with 5 {S} or more.",
};
