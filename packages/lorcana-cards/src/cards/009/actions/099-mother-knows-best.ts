import type { ActionCard } from "@tcg/lorcana-types";

export const motherKnowsBest: ActionCard = {
  id: "17a",
  cardType: "action",
  name: "Mother Knows Best",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "009",
  text: "Return chosen character to their player's hand.",
  actionSubtype: "song",
  cost: 3,
  cardNumber: 99,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "9b13536dce3331ad25596984ff3b7f2f4a66b1f4",
  },
  abilities: [
    {
      id: "17a-1",
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
      text: "Return chosen character to their player's hand.",
    },
  ],
};
