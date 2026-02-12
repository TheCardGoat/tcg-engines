import type { ActionCard } from "@tcg/lorcana-types";

export const riseOfTheTitans: ActionCard = {
  abilities: [
    {
      effect: {
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["location"],
        },
        type: "banish",
      },
      id: "68m-1",
      text: "Banish chosen location or item.",
      type: "action",
    },
  ],
  cardNumber: 198,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "167ce3ffa872b248ed98311ea3be37caf99525c5",
  },
  franchise: "Hercules",
  id: "68m",
  inkType: ["steel"],
  inkable: true,
  missingTests: true,
  name: "Rise of the Titans",
  set: "003",
  text: "Banish chosen location or item.",
};
