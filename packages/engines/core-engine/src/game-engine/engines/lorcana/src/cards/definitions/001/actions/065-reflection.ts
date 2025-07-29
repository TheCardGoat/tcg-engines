import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const reflection: LorcanaActionCardDefinition = {
  id: "brz",
  name: "Reflection",
  characteristics: ["action", "song"],
  text: "Look at the top 3 cards of your deck. Put them back on the top of your deck in any order.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Look at the top 3 cards of your deck. Put them back on the top of your deck in any order.",
      effects: [
        {
          type: "scry",
          parameters: {
            lookAt: 3,
            destinations: [
              {
                zone: "deck",
                position: "top",
                count: 3,
                order: "any",
              },
            ],
          },
        },
      ],
    },
  ],
  flavour: "When will my reflection show \nWho I am inside?",
  inkwell: true,
  colors: ["amethyst"],
  cost: 1,
  illustrator: "Kevin Hong",
  number: 65,
  set: "TFC",
  rarity: "common",
};
