import type { ActionCard } from "@tcg/lorcana-types";

export const stoppedChaosInItsTracks: ActionCard = {
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
        type: "return-to-hand",
      },
      id: "pmx-1",
      text: "Sing Together 8 Return up to 2 chosen characters with 3 {S} or less each to their player's hand.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 115,
  cardType: "action",
  cost: 8,
  externalIds: {
    ravensburger: "5c657945db38e14571f723706bbcd7ec55085acb",
  },
  franchise: "Hercules",
  id: "pmx",
  inkType: ["emerald"],
  inkable: true,
  missingTests: true,
  name: "Stopped Chaos in Its Tracks",
  set: "008",
  text: "Sing Together 8 Return up to 2 chosen characters with 3 {S} or less each to their player's hand.",
};
