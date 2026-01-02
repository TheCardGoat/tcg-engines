import type { ActionCard } from "@tcg/lorcana-types";

export const tangle: ActionCard = {
  id: "1ly",
  cardType: "action",
  name: "Tangle",
  inkType: ["ruby"],
  franchise: "Tangled",
  set: "001",
  text: "Each opponent loses 1 lore.",
  cost: 2,
  cardNumber: 133,
  inkable: true,
  externalIds: {
    ravensburger: "d0e86cdf581903f6ffa738cc6e7a138625d40ed2",
  },
  abilities: [
    {
      id: "1ly-1",
      text: "Each opponent loses 1 lore.",
      type: "action",
      effect: {
        type: "lose-lore",
        amount: 1,
        target: "EACH_OPPONENT",
      },
    },
  ],
};
