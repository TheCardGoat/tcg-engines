import type { ActionCard } from "@tcg/lorcana-types";

export const packTactics: ActionCard = {
  abilities: [
    {
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      id: "1iw-1",
      text: "Gain 1 lore for each damaged character opponents have in play.",
      type: "action",
    },
  ],
  cardNumber: 100,
  cardType: "action",
  cost: 4,
  externalIds: {
    ravensburger: "c521d6e9ff9951f603c95de81a152ae766eebcb9",
  },
  franchise: "Emperors New Groove",
  id: "1iw",
  inkType: ["emerald"],
  inkable: true,
  missingTests: true,
  name: "Pack Tactics",
  set: "002",
  text: "Gain 1 lore for each damaged character opponents have in play.",
};
