import type { ActionCard } from "@tcg/lorcana-types";

export const bounce: ActionCard = {
  id: "1fq",
  cardType: "action",
  name: "Bounce",
  inkType: ["emerald"],
  franchise: "Winnie the Pooh",
  set: "002",
  text: "Return chosen character of yours to your hand to return another chosen character to their player's hand.",
  cost: 2,
  cardNumber: 97,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "b85b9b0d27f8d3a0741d01cb289b25aab4f498e3",
  },
  abilities: [
    {
      id: "1fq-1",
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
      text: "Return chosen character of yours to your hand to return another chosen character to their player's hand.",
    },
  ],
};
