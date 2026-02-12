import type { ActionCard } from "@tcg/lorcana-types";

export const hasSetMyHeaaaaaaart: ActionCard = {
  abilities: [
    {
      effect: {
        type: "banish",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["item"],
        },
      },
      id: "4bh-1",
      text: "Banish chosen item.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 94,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "0f90fdf72f661609d43e8e558f069305b91a4e05",
  },
  id: "4bh",
  inkType: ["emerald"],
  inkable: true,
  missingTests: true,
  name: "Has Set My Heaaaaaaart . . .",
  set: "003",
  text: "Banish chosen item.",
};
