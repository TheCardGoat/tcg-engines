import type { ActionCard } from "@tcg/lorcana-types";

export const wakeUpAlice: ActionCard = {
  id: "7tg",
  cardType: "action",
  name: "Wake Up, Alice!",
  inkType: ["emerald"],
  franchise: "Alice in Wonderland",
  set: "007",
  text: "Return chosen damaged character to their player's hand.",
  cost: 1,
  cardNumber: 116,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1c2d6362749cb836c4d2e5f90fe707296e30c1fc",
  },
  abilities: [
    {
      id: "7tg-1",
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
      text: "Return chosen damaged character to their player's hand.",
    },
  ],
};
