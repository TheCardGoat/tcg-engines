import type { ActionCard } from "@tcg/lorcana-types";

export const glimmerVsGlimmer: ActionCard = {
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
      id: "e3r-1",
      text: "Banish chosen character of yours to banish chosen character.",
      type: "action",
    },
  ],
  cardNumber: 130,
  cardType: "action",
  cost: 4,
  externalIds: {
    ravensburger: "32d58396c6366bd44e37140214651921b4bc231f",
  },
  franchise: "Lorcana",
  id: "e3r",
  inkType: ["ruby"],
  inkable: false,
  missingTests: true,
  name: "Glimmer vs Glimmer",
  set: "005",
  text: "Banish chosen character of yours to banish chosen character.",
};
