import type { ActionCard } from "@tcg/lorcana-types";

export const motherKnowsBest: ActionCard = {
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
        type: "return-to-hand",
      },
      id: "17a-1",
      text: "Return chosen character to their player's hand.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 99,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "9b13536dce3331ad25596984ff3b7f2f4a66b1f4",
  },
  franchise: "Tangled",
  id: "17a",
  inkType: ["emerald"],
  inkable: false,
  missingTests: true,
  name: "Mother Knows Best",
  set: "009",
  text: "Return chosen character to their player's hand.",
};
