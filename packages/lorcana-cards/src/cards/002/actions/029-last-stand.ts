import type { ActionCard } from "@tcg/lorcana-types";

export const lastStand: ActionCard = {
  id: "e4d",
  cardType: "action",
  name: "Last Stand",
  inkType: ["amber"],
  franchise: "Raya and the Last Dragon",
  set: "002",
  text: "Banish chosen character who was challenged this turn.",
  cost: 2,
  cardNumber: 29,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "32e50e39d9753fadc5753212222ae6fc6b0d2376",
  },
  abilities: [
    {
      id: "e4d-1",
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
      text: "Banish chosen character who was challenged this turn.",
    },
  ],
};
