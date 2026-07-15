import type { ActionCard } from "@tcg/lorcana-types";

export const lostInTheWoods: ActionCard = {
  abilities: [
    {
      effect: {
        modifier: -2,
        stat: "strength",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      id: "6hj-1",
      name: "All opposing",
      text: "All opposing characters get -2 {S} until the start of your next turn.",
      type: "static",
    },
  ],
  actionSubtype: "song",
  cardNumber: 28,
  cardType: "action",
  cost: 4,
  externalIds: {
    ravensburger: "17618cced0ecdbed9cd4811b627105e902448fa6",
  },
  franchise: "Frozen",
  id: "6hj",
  inkType: ["amber"],
  inkable: true,
  missingTests: true,
  name: "Lost in the Woods",
  set: "009",
  text: "All opposing characters get -2 {S} until the start of your next turn.",
};
