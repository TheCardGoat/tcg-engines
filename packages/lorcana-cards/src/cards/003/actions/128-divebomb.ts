import type { ActionCard } from "@tcg/lorcana-types";

export const divebomb: ActionCard = {
  abilities: [
    {
      effect: {
        target: {
          cardTypes: ["character"],
          count: "all",
          owner: "you",
          selector: "all",
          zones: ["play"],
        },
        type: "banish",
      },
      id: "1ei-1",
      text: "Banish one of your characters with Reckless to banish chosen character with less {S} than that character.",
      type: "action",
    },
  ],
  cardNumber: 128,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "b79271249a893d1000e32bdb11f4305ccf9defd7",
  },
  franchise: "Aladdin",
  id: "1ei",
  inkType: ["ruby"],
  inkable: true,
  missingTests: true,
  name: "Divebomb",
  set: "003",
  text: "Banish one of your characters with Reckless to banish chosen character with less {S} than that character.",
};
