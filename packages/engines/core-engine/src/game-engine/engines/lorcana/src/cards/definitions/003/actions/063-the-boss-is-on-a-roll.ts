import { gainLoreEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theBossIsOnARoll: LorcanaActionCardDefinition = {
  id: "lfb",
  missingTestCase: true,
  name: "The Boss Is on a Roll",
  characteristics: ["action", "song"],
  text: "Look at the top 5 cards of your deck. Put any number of them on the top or the bottom of your deck in any order. Gain 1 lore.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Look at the top 5 cards of your deck. Put any number of them on the top or the bottom of your deck in any order. Gain 1 lore.",
      effects: [
        {
          type: "scry",
          parameters: {
            lookAt: 5,
            destinations: [
              {
                zone: "deck",
                position: "top",
                min: 0,
                max: 5,
              },
              {
                zone: "deck",
                position: "bottom",
                remainder: true,
              },
            ],
          },
        },
        gainLoreEffect({ targets: [selfPlayerTarget] }),
      ],
    },
  ],
  flavour: "Go ahead! Make your choice!",
  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  illustrator: "Koni",
  number: 63,
  set: "ITI",
  rarity: "rare",
};
