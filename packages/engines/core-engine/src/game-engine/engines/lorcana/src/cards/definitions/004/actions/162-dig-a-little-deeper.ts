import { singerTogetherAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/singTogetherAbility";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const digALittleDeeper: LorcanaActionCardDefinition = {
  id: "vrj",
  missingTestCase: true,
  name: "Dig A Little Deeper",
  characteristics: ["action", "song"],
  text: "**Sing Together** 8 _(Any number of your of your teammates' characters with total cost 8 or more may {E} to sing this song for free.)_\n\n\nLook at the top 7 cards of your deck. Put 2 into your hand. Put the rest on the bottom of your deck in any order.",
  type: "action",
  abilities: [
    singerTogetherAbility(8),
    {
      type: "static",
      text: "Look at the top 7 cards of your deck. Put 2 into your hand. Put the rest on the bottom of your deck in any order.",
      effects: [
        {
          type: "scry",
          parameters: {
            lookAt: 7,
            destinations: [
              {
                zone: "hand",
                count: 2,
              },
              {
                zone: "deck",
                position: "bottom",
                remainder: true,
                order: "any",
              },
            ],
          },
        },
      ],
    },
  ],
  colors: ["sapphire"],
  cost: 8,
  illustrator: "Rachel Elese",
  number: 162,
  set: "URR",
  rarity: "uncommon",
};
