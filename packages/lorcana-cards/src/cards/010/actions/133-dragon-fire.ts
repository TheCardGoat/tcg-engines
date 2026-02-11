import type { ActionCard } from "@tcg/lorcana-types";

export const dragonFire: ActionCard = {
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
      id: "1o2-1",
      text: "Banish chosen character.",
      type: "action",
    },
  ],
  cardNumber: 133,
  cardType: "action",
  cost: 5,
  externalIds: {
    ravensburger: "d9ec006d3956dca4006cbf745c589057a0ba0663",
  },
  franchise: "Sleeping Beauty",
  id: "1o2",
  inkType: ["ruby"],
  inkable: false,
  missingTests: true,
  name: "Dragon Fire",
  set: "010",
  text: "Banish chosen character.",
};
