import type { ActionCard } from "@tcg/lorcana";

export const cutToTheChase: ActionCard = {
  id: "5a0",
  cardType: "action",
  name: "Cut to the Chase",
  inkType: ["ruby"],
  set: "001",
  text: "Chosen character gains Rush this turn. (They can challenge the turn they're played.)",
  cost: 2,
  cardNumber: 129,
  inkable: true,
  externalIds: {
    ravensburger: "13057e6bb6112157b88c4ebbaec83cc1a20d9e5c",
  },
  abilities: [
    {
      id: "5a0-1",
      text: "Chosen character gains Rush this turn.",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Rush",
        target: "CHOSEN_CHARACTER",
        duration: "turn",
      },
    },
  ],
};
