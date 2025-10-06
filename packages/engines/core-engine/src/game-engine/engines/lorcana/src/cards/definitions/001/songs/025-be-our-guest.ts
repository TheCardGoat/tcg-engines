import type { ScryEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const beOurGuest: LorcanaActionCardDefinition = {
  id: "m6n",
  reprints: ["cwb"],
  name: "Be Our Guest",
  characteristics: ["action", "song"],
  text: "_(A character with cost 2 or more can {E} to sing this\rsong for free.)_\nLook at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Be Our Guest",
      text: "Look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      optional: false,
      effects: [
        {
          type: "scry",
          amount: 4,
          mode: "bottom",
          shouldRevealTutored: true,
          limits: {
            bottom: 4,
            inkwell: 0,
            top: 0,
            hand: 1,
          },
          tutorFilters: [
            { filter: "owner", value: "self" },
            { filter: "type", value: "character" },
            { filter: "zone", value: "deck" },
          ],
        } as ScryEffect,
      ],
    },
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  illustrator: "R. La Barbera / L. Giammichele",
  number: 25,
  set: "TFC",
  rarity: "uncommon",
};
