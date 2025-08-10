import { millEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { eachOpponentTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const aVeryMerryUnbirthday: LorcanaActionCardDefinition = {
  id: "pfv",
  missingTestCase: true,
  name: "A Very Merry Unbirthday",
  characteristics: ["action", "song"],
  text: "(A character with cost 1 or more can {E} to sing this song for free.)\nEach opponent puts the top 2 cards of their deck into their discard.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Each opponent puts the top 2 cards of their deck into their discard.",
      targets: [eachOpponentTarget],
      effects: [
        millEffect({
          value: 2,
        }),
      ],
    },
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 1,
  illustrator: "Geoffrey Bodeau",
  number: 60,
  set: "006",
  rarity: "common",
};
