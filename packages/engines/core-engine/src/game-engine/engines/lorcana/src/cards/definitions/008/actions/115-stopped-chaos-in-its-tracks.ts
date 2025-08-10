import { returnCardEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { singerTogetherAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/singTogetherAbility";
import {
  chosenCharacterWithTarget,
  upToTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const stoppedChaosInItsTracks: LorcanaActionCardDefinition = {
  id: "cm3",
  name: "Stopped Chaos In Its Tracks",
  characteristics: ["action", "song"],
  text: "Sing Together 8\nReturn up to 2 chosen characters with 3 {S} or less each to their player's hand.",
  type: "action",
  inkwell: true,
  colors: ["emerald"],
  cost: 8,
  illustrator: "Edu Francisco",
  number: 115,
  set: "008",
  rarity: "uncommon",
  abilities: [
    singerTogetherAbility(8),
    {
      type: "static",
      text: "Return up to 2 chosen characters with 3 {S} or less each to their player's hand.",
      effects: [
        returnCardEffect({
          to: "hand",
          from: "play",
          targets: upToTarget({
            target: chosenCharacterWithTarget({
              attribute: "strength",
              comparison: "lte",
              value: 3,
            }),
            upTo: 2,
          }),
        }),
      ],
    },
  ],
};
