import type { ActionCard } from "@tcg/lorcana-types";

export const heWhoStealsAndRunsAway: ActionCard = {
  abilities: [
    {
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
      id: "h00-1",
      text: "Banish chosen item. Draw a card.",
      type: "action",
    },
  ],
  cardNumber: 114,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "3d45421a0885dfede8dd05b57fef4f66b00074e9",
  },
  franchise: "Talespin",
  id: "h00",
  inkType: ["emerald"],
  inkable: true,
  missingTests: true,
  name: "He Who Steals and Runs Away",
  set: "008",
  text: "Banish chosen item. Draw a card.",
};
