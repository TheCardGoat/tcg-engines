import type { ActionCard } from "@tcg/lorcana-types";

export const restoringTheCrown: ActionCard = {
  abilities: [
    {
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
      id: "1ss-1",
      text: "Exert all opposing characters. Whenever one of your characters banishes another character in a challenge this turn, gain 2 lore.",
      type: "action",
    },
  ],
  cardNumber: 83,
  cardType: "action",
  cost: 6,
  externalIds: {
    ravensburger: "e9790e95ed228e5ba1499db77a02cb0f08ae189b",
  },
  franchise: "Aladdin",
  id: "1ss",
  inkType: ["amethyst", "steel"],
  inkable: false,
  missingTests: true,
  name: "Restoring the Crown",
  set: "007",
  text: "Exert all opposing characters. Whenever one of your characters banishes another character in a challenge this turn, gain 2 lore.",
};
