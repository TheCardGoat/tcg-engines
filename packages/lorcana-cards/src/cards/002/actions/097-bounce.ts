import type { ActionCard } from "@tcg/lorcana-types";

export const bounce: ActionCard = {
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
      id: "1fq-1",
      text: "Return chosen character of yours to your hand to return another chosen character to their player's hand.",
      type: "action",
    },
  ],
  cardNumber: 97,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "b85b9b0d27f8d3a0741d01cb289b25aab4f498e3",
  },
  franchise: "Winnie the Pooh",
  id: "1fq",
  inkType: ["emerald"],
  inkable: false,
  missingTests: true,
  name: "Bounce",
  set: "002",
  text: "Return chosen character of yours to your hand to return another chosen character to their player's hand.",
};
