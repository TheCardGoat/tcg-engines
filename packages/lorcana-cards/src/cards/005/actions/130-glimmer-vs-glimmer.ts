import type { ActionCard } from "@tcg/lorcana-types";

export const glimmerVsGlimmer: ActionCard = {
  id: "e3r",
  cardType: "action",
  name: "Glimmer vs Glimmer",
  inkType: ["ruby"],
  franchise: "Lorcana",
  set: "005",
  text: "Banish chosen character of yours to banish chosen character.",
  cost: 4,
  cardNumber: 130,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "32d58396c6366bd44e37140214651921b4bc231f",
  },
  abilities: [
    {
      id: "e3r-1",
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
      text: "Banish chosen character of yours to banish chosen character.",
    },
  ],
};
