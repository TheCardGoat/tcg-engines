import type { ActionCard } from "@tcg/lorcana-types";

export const theMostDiabolicalScheme: ActionCard = {
  abilities: [
    {
      effect: {
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "banish",
      },
      id: "hlj-1",
      text: "Banish chosen Villain of yours to banish chosen character.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 131,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "3f6d21f1b5fcecdb1b1f40696d7d1016f0e483ba",
  },
  franchise: "Great Mouse Detective",
  id: "hlj",
  inkType: ["ruby"],
  inkable: false,
  missingTests: true,
  name: "The Most Diabolical Scheme",
  set: "002",
  text: "Banish chosen Villain of yours to banish chosen character.",
};
