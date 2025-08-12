import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const howFarIllGo: LorcanaActionCardDefinition = {
  id: "x7c",
  name: "How Far I'll Go",
  characteristics: ["action", "song"],
  text: "Look at the top 2 cards of your deck. Put one into your hand and the other into your inkwell facedown and exerted.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Look at the top 2 cards of your deck. Put one into your hand and the other into your inkwell facedown and exerted.",
      effects: [
        {
          type: "scry",
          parameters: {
            lookAt: 2,
            destinations: [
              {
                zone: "hand",
                count: 1,
              },
              {
                zone: "inkwell",
                count: 1,
                exerted: true,
              },
            ],
          },
        },
      ],
    },
  ],
  colors: ["sapphire"],
  cost: 4,
  illustrator: "Anna Rud / Anna Stosik",
  number: 161,
  set: "ITI",
  rarity: "uncommon",
};
