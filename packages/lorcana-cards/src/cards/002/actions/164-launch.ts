import type { ActionCard } from "@tcg/lorcana-types";

export const launch: ActionCard = {
  abilities: [
    {
      effect: {
        type: "deal-damage",
        amount: 5,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      id: "1wz-1",
      text: "Banish chosen item of yours to deal 5 damage to chosen character.",
      type: "action",
    },
  ],
  cardNumber: 164,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "f7c91fefc9c39de1eb3c3dbcd95ef44db5e47f38",
  },
  franchise: "Lorcana",
  id: "1wz",
  inkType: ["sapphire"],
  inkable: false,
  missingTests: true,
  name: "Launch",
  set: "002",
  text: "Banish chosen item of yours to deal 5 damage to chosen character.",
};
