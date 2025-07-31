import { singerTogetherAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import { self } from "@lorcanito/lorcana-engine/abilities/targets";
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
      type: "resolution",
      effects: [
        {
          type: "scry",
          amount: 5,
          mode: "bottom",
          shouldRevealTutored: true,
          target: self,
          limits: {
            bottom: 5,
            inkwell: 0,
            hand: 2,
            top: 0,
            discard: 0,
          },
          tutorFilters: [
            { filter: "owner", value: "self" },
            { filter: "zone", value: "deck" },
            { filter: "type", value: "character" },
          ],
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
