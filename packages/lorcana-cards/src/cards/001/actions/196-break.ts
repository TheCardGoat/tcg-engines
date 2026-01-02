import type { ActionCard } from "@tcg/lorcana";

export const breakCard: ActionCard = {
  id: "m37",
  cardType: "action",
  name: "Break",
  inkType: ["steel"],
  franchise: "Beauty and the Beast",
  set: "001",
  text: "Banish chosen item.",
  cost: 2,
  cardNumber: 196,
  inkable: true,
  externalIds: {
    ravensburger: "4f9cac8dbc4c67a388b8379dcc126c90c7c5e72a",
  },
  abilities: [
    {
      id: "m37-1",
      text: "Banish chosen item.",
      type: "action",
      effect: {
        type: "banish",
        target: "CHOSEN_CHARACTER",
      },
    },
  ],
};
