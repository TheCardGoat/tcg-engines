import type { ActionCard } from "@tcg/lorcana-types";

export const heWhoStealsAndRunsAway: ActionCard = {
  id: "h00",
  cardType: "action",
  name: "He Who Steals and Runs Away",
  inkType: ["emerald"],
  franchise: "Talespin",
  set: "008",
  text: "Banish chosen item. Draw a card.",
  cost: 3,
  cardNumber: 114,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3d45421a0885dfede8dd05b57fef4f66b00074e9",
  },
  abilities: [
    {
      id: "h00-1",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "banish",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["item"],
            },
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
      text: "Banish chosen item. Draw a card.",
    },
  ],
};
