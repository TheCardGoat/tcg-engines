import { putOneIntoYourHand } from "~/game-engine/engines/lorcana/src/abilities/effect/scry";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const developYourBrain: LorcanaActionCardDefinition = {
  id: "yy9",
  name: "Develop Your Brain",
  characteristics: ["action"],
  text: "Look at the top 2 cards of your deck. Put one into your hand and the other on the bottom of the deck.",
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
              putOneIntoYourHand,
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
  flavour:
    "„Knowledge, wisdom−there's the <b>real</b> power!\u0003<br />−Merlin",
  inkwell: true,
  colors: ["sapphire"],
  cost: 1,
  illustrator: "Pao Yong",
  number: 161,
  set: "TFC",
  rarity: "common",
};
