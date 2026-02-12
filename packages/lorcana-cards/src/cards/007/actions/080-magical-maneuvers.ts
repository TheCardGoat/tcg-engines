import type { ActionCard } from "@tcg/lorcana-types";

export const magicalManeuvers: ActionCard = {
  abilities: [
    {
      effect: {
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
        type: "sequence",
      },
      id: "1nx-1",
      text: "Return chosen character of yours to your hand. Exert chosen character.",
      type: "action",
    },
  ],
  cardNumber: 80,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "d587c3f09f6a2381566ef6cc840935c84c29d8dc",
  },
  franchise: "Sleeping Beauty",
  id: "1nx",
  inkType: ["amethyst"],
  inkable: true,
  missingTests: true,
  name: "Magical Maneuvers",
  set: "007",
  text: "Return chosen character of yours to your hand. Exert chosen character.",
};
