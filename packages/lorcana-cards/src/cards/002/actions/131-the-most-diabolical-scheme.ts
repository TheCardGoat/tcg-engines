import type { ActionCard } from "@tcg/lorcana-types";

export const theMostDiabolicalScheme: ActionCard = {
  id: "hlj",
  cardType: "action",
  name: "The Most Diabolical Scheme",
  inkType: ["ruby"],
  franchise: "Great Mouse Detective",
  set: "002",
  text: "Banish chosen Villain of yours to banish chosen character.",
  actionSubtype: "song",
  cost: 3,
  cardNumber: 131,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "3f6d21f1b5fcecdb1b1f40696d7d1016f0e483ba",
  },
  abilities: [
    {
      id: "hlj-1",
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
      text: "Banish chosen Villain of yours to banish chosen character.",
    },
  ],
};
