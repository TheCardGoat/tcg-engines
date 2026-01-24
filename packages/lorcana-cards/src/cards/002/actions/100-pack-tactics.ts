import type { ActionCard } from "@tcg/lorcana-types";

export const packTactics: ActionCard = {
  id: "1iw",
  cardType: "action",
  name: "Pack Tactics",
  inkType: ["emerald"],
  franchise: "Emperors New Groove",
  set: "002",
  text: "Gain 1 lore for each damaged character opponents have in play.",
  cost: 4,
  cardNumber: 100,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c521d6e9ff9951f603c95de81a152ae766eebcb9",
  },
  abilities: [
    {
      id: "1iw-1",
      type: "action",
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      text: "Gain 1 lore for each damaged character opponents have in play.",
    },
  ],
};
