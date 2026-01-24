import type { ActionCard } from "@tcg/lorcana-types";

export const restoringTheCrown: ActionCard = {
  id: "1ss",
  cardType: "action",
  name: "Restoring the Crown",
  inkType: ["amethyst", "steel"],
  franchise: "Aladdin",
  set: "007",
  text: "Exert all opposing characters. Whenever one of your characters banishes another character in a challenge this turn, gain 2 lore.",
  cost: 6,
  cardNumber: 83,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "e9790e95ed228e5ba1499db77a02cb0f08ae189b",
  },
  abilities: [
    {
      id: "1ss-1",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "exert",
            target: {
              selector: "all",
              count: "all",
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "gain-lore",
            amount: 2,
          },
        ],
      },
      text: "Exert all opposing characters. Whenever one of your characters banishes another character in a challenge this turn, gain 2 lore.",
    },
  ],
};
