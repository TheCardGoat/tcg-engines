import { singerTogetherAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/singTogetherAbility";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const lookAtThisFamily: LorcanaActionCardDefinition = {
  id: "hgt",
  missingTestCase: true,
  name: "Look At This Family",
  characteristics: ["action", "song"],
  text: "**Sing Together** 7 _(Any number of your of your teammates' characters with total cost 7 or more may {E} to sing this song for free.)_\n\n\nLook at the top 5 cards of your deck. You may reveal up to 2 character cards and put them into your hand. Put the rest on the bottom of your deck in any order.",
  type: "action",
  abilities: [
    singerTogetherAbility(7),
    {
      type: "static",
      text: "Look at the top 5 cards of your deck. You may reveal up to 2 character cards and put them into your hand. Put the rest on the bottom of your deck in any order.",
      effects: [
        {
          type: "scry",
          parameters: {
            lookAt: 5,
            destinations: [
              {
                zone: "hand",
                min: 0,
                max: 2,
                reveal: true,
                filter: {
                  type: ["character"],
                },
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
  inkwell: true,
  colors: ["amber"],
  cost: 7,
  illustrator: "Giulia Riva",
  number: 28,
  set: "URR",
  rarity: "rare",
};
