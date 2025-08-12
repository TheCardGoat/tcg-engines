import { moveToLocationEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import {
  upToTarget,
  yourCharactersTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const voyage: LorcanaActionCardDefinition = {
  id: "y55",
  name: "Voyage",
  characteristics: ["action"],
  text: "Move up to 2 characters of yours to the same location for free.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Move up to 2 characters of yours to the same location for free.",
      effects: [
        moveToLocationEffect({
          targets: upToTarget({
            target: yourCharactersTarget,
            upTo: 2,
          }),
          cost: 0,
          sameLocation: true,
        }),
      ],
    },
  ],
  flavour: "We were voyagers! Why'd we stop? –Moana",
  inkwell: true,
  colors: ["ruby"],
  cost: 1,
  illustrator: "Alex Shin",
  number: 131,
  set: "ITI",
  rarity: "common",
};
