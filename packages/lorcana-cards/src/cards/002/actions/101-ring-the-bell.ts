import type { ActionCard } from "@tcg/lorcana-types";

export const ringTheBell: ActionCard = {
  abilities: [
    {
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
      id: "eam-1",
      text: "Banish chosen damaged character.",
      type: "action",
    },
  ],
  cardNumber: 101,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "33859d5b1f672f1eb04078991404e42b82ae7f43",
  },
  franchise: "Great Mouse Detective",
  id: "eam",
  inkType: ["emerald"],
  inkable: true,
  missingTests: true,
  name: "Ring the Bell",
  set: "002",
  text: "Banish chosen damaged character.",
};
