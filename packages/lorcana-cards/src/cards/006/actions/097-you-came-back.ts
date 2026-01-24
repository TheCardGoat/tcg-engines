import type { ActionCard } from "@tcg/lorcana-types";

export const youCameBack: ActionCard = {
  id: "1dw",
  cardType: "action",
  name: "You Came Back",
  inkType: ["emerald"],
  franchise: "Lilo and Stitch",
  set: "006",
  text: "Ready chosen character.",
  cost: 3,
  cardNumber: 97,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "b2698b79ffc3b73ed2fbd0eb78ade15a624dace1",
  },
  abilities: [
    {
      id: "1dw-1",
      type: "action",
      effect: {
        type: "ready",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "Ready chosen character.",
    },
  ],
};
