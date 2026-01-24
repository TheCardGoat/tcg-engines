import type { ActionCard } from "@tcg/lorcana-types";

export const magicalManeuvers: ActionCard = {
  id: "1nx",
  cardType: "action",
  name: "Magical Maneuvers",
  inkType: ["amethyst"],
  franchise: "Sleeping Beauty",
  set: "007",
  text: "Return chosen character of yours to your hand. Exert chosen character.",
  cost: 2,
  cardNumber: 80,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d587c3f09f6a2381566ef6cc840935c84c29d8dc",
  },
  abilities: [
    {
      id: "1nx-1",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "return-to-hand",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "exert",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
        ],
      },
      text: "Return chosen character of yours to your hand. Exert chosen character.",
    },
  ],
};
