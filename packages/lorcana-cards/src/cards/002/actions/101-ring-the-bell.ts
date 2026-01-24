import type { ActionCard } from "@tcg/lorcana-types";

export const ringTheBell: ActionCard = {
  id: "eam",
  cardType: "action",
  name: "Ring the Bell",
  inkType: ["emerald"],
  franchise: "Great Mouse Detective",
  set: "002",
  text: "Banish chosen damaged character.",
  cost: 3,
  cardNumber: 101,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "33859d5b1f672f1eb04078991404e42b82ae7f43",
  },
  abilities: [
    {
      id: "eam-1",
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
      text: "Banish chosen damaged character.",
    },
  ],
};
