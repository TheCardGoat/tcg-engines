import type { ActionCard } from "@tcg/lorcana-types";

export const brawl: ActionCard = {
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
      id: "axa-1",
      text: "Banish chosen character with 2 {S} or less.",
      type: "action",
    },
  ],
  cardNumber: 130,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "275f6a87f41c07adb1007eb7d1b5a6c177b506c7",
  },
  franchise: "Tangled",
  id: "axa",
  inkType: ["ruby"],
  inkable: true,
  missingTests: true,
  name: "Brawl",
  set: "004",
  text: "Banish chosen character with 2 {S} or less.",
};
