import type { ActionCard } from "@tcg/lorcana-types";

export const divebomb: ActionCard = {
  id: "1ei",
  cardType: "action",
  name: "Divebomb",
  inkType: ["ruby"],
  franchise: "Aladdin",
  set: "003",
  text: "Banish one of your characters with Reckless to banish chosen character with less {S} than that character.",
  cost: 3,
  cardNumber: 128,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b79271249a893d1000e32bdb11f4305ccf9defd7",
  },
  abilities: [
    {
      id: "1ei-1",
      type: "action",
      effect: {
        type: "banish",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "Banish one of your characters with Reckless to banish chosen character with less {S} than that character.",
    },
  ],
};
