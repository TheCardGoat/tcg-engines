import type { ActionCard } from "@tcg/lorcana-types";

export const stoppedChaosInItsTracks: ActionCard = {
  id: "pmx",
  cardType: "action",
  name: "Stopped Chaos in Its Tracks",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "008",
  text: "Sing Together 8 Return up to 2 chosen characters with 3 {S} or less each to their player's hand.",
  actionSubtype: "song",
  cost: 8,
  cardNumber: 115,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5c657945db38e14571f723706bbcd7ec55085acb",
  },
  abilities: [
    {
      id: "pmx-1",
      type: "action",
      effect: {
        type: "return-to-hand",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "Sing Together 8 Return up to 2 chosen characters with 3 {S} or less each to their player's hand.",
    },
  ],
};
