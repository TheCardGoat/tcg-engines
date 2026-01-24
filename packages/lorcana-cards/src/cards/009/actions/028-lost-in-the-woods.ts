import type { ActionCard } from "@tcg/lorcana-types";

export const lostInTheWoods: ActionCard = {
  id: "6hj",
  cardType: "action",
  name: "Lost in the Woods",
  inkType: ["amber"],
  franchise: "Frozen",
  set: "009",
  text: "All opposing characters get -2 {S} until the start of your next turn.",
  actionSubtype: "song",
  cost: 4,
  cardNumber: 28,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "17618cced0ecdbed9cd4811b627105e902448fa6",
  },
  abilities: [
    {
      id: "6hj-1",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -2,
        target: "CHOSEN_CHARACTER",
      },
      name: "All opposing",
      text: "All opposing characters get -2 {S} until the start of your next turn.",
    },
  ],
};
