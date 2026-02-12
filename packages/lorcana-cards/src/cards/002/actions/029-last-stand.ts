import type { ActionCard } from "@tcg/lorcana-types";

export const lastStand: ActionCard = {
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
      id: "e4d-1",
      text: "Banish chosen character who was challenged this turn.",
      type: "action",
    },
  ],
  cardNumber: 29,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "32e50e39d9753fadc5753212222ae6fc6b0d2376",
  },
  franchise: "Raya and the Last Dragon",
  id: "e4d",
  inkType: ["amber"],
  inkable: false,
  missingTests: true,
  name: "Last Stand",
  set: "002",
  text: "Banish chosen character who was challenged this turn.",
};
