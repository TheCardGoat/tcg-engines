import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const invitedToTheBallAction: LorcanaActionCardDefinition = {
  id: "lnv",
  missingTestCase: true,
  name: "Invited to the Ball",
  characteristics: ["action"],
  text: "Reveal the top 2 cards of your deck. Put revealed character cards into your hand. Put the rest on the bottom of your deck in any order.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Reveal the top 2 cards of your deck. Put revealed character cards into your hand. Put the rest on the bottom of your deck in any order.",
      targets: [selfPlayerTarget],
      effects: [
        {
          type: "scry",
          parameters: {
            lookAt: 2,
            destinations: [
              {
                zone: "hand",
                count: -1, // All revealed character cards
                filter: {
                  cardType: "character",
                },
                reveal: true,
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
  colors: ["amber"],
  cost: 2,
  illustrator: "Taraneh",
  number: 29,
  set: "SSK",
  rarity: "uncommon",
};
