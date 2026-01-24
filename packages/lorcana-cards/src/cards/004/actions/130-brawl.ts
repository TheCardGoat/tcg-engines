import type { ActionCard } from "@tcg/lorcana-types";

export const brawl: ActionCard = {
  id: "axa",
  cardType: "action",
  name: "Brawl",
  inkType: ["ruby"],
  franchise: "Tangled",
  set: "004",
  text: "Banish chosen character with 2 {S} or less.",
  cost: 3,
  cardNumber: 130,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "275f6a87f41c07adb1007eb7d1b5a6c177b506c7",
  },
  abilities: [
    {
      id: "axa-1",
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
      text: "Banish chosen character with 2 {S} or less.",
    },
  ],
};
