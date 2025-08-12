import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const visionOfTheFuture: LorcanaActionCardDefinition = {
  id: "aks",
  missingTestCase: true,
  name: "Vision of the Future",
  characteristics: ["action"],
  text: "Look at the top 5 cards of your deck. Put one into your hand and the rest on the bottom of your deck in any order.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Look at the top 5 cards of your deck. Put one into your hand and the rest on the bottom of your deck in any order.",
      effects: [
        {
          type: "scry",
          parameters: {
            lookAt: 5,
            destinations: [
              {
                zone: "hand",
                count: 1,
              },
              {
                zone: "deck",
                remainder: true,
                position: "bottom",
              },
            ],
          },
        },
      ],
    },
  ],
  flavour:
    "We must repair the Illuminary before it’s too late. And we’ll need these devices, these chromicons, to fix it.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  illustrator: "Leonardo Giammichele",
  number: 160,
  set: "SSK",
  rarity: "common",
};
