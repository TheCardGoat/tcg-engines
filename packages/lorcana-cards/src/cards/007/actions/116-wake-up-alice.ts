import type { ActionCard } from "@tcg/lorcana-types";

export const wakeUpAlice: ActionCard = {
  abilities: [
    {
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
      id: "7tg-1",
      text: "Return chosen damaged character to their player's hand.",
      type: "action",
    },
  ],
  cardNumber: 116,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "1c2d6362749cb836c4d2e5f90fe707296e30c1fc",
  },
  franchise: "Alice in Wonderland",
  id: "7tg",
  inkType: ["emerald"],
  inkable: true,
  missingTests: true,
  name: "Wake Up, Alice!",
  set: "007",
  text: "Return chosen damaged character to their player's hand.",
};
