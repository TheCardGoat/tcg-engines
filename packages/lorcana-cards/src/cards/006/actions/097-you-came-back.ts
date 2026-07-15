import type { ActionCard } from "@tcg/lorcana-types";

export const youCameBack: ActionCard = {
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
        type: "ready",
      },
      id: "1dw-1",
      text: "Ready chosen character.",
      type: "action",
    },
  ],
  cardNumber: 97,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "b2698b79ffc3b73ed2fbd0eb78ade15a624dace1",
  },
  franchise: "Lilo and Stitch",
  id: "1dw",
  inkType: ["emerald"],
  inkable: false,
  missingTests: true,
  name: "You Came Back",
  set: "006",
  text: "Ready chosen character.",
};
