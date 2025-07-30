import { THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import {
  drawCardEffect,
  getEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import {
  chosenCharacterTarget,
  upToTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const paintingTheRosesRed: LorcanaActionCardDefinition = {
  id: "g0a",
  name: "Painting the Roses Red",
  characteristics: ["action", "song"],
  text: "Up to 2 chosen characters get -1 {S} this turn. Draw a card.",
  type: "action",
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  illustrator: "Matt Chapman",
  number: 30,
  set: "ROF",
  rarity: "common",
  abilities: [
    {
      type: "static",
      text: "Up to 2 chosen characters get -1 {S} this turn. Draw a card.",
      effects: [
        getEffect({
          targets: upToTarget({
            target: chosenCharacterTarget,
            upTo: 2,
          }),
          attribute: "strength",
          value: -1,
          duration: THIS_TURN,
        }),
        drawCardEffect({ targets: [selfPlayerTarget] }),
      ],
    },
  ],
};
