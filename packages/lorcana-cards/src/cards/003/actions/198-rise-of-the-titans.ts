import type { ActionCard } from "@tcg/lorcana-types";

export const riseOfTheTitans: ActionCard = {
  id: "68m",
  cardType: "action",
  name: "Rise of the Titans",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "003",
  text: "Banish chosen location or item.",
  cost: 3,
  cardNumber: 198,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "167ce3ffa872b248ed98311ea3be37caf99525c5",
  },
  abilities: [
    {
      id: "68m-1",
      type: "action",
      effect: {
        type: "banish",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["location"],
        },
      },
      text: "Banish chosen location or item.",
    },
  ],
};
