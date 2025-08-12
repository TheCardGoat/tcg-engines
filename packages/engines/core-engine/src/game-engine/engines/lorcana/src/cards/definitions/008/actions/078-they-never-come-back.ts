import { DURING_THEIR_NEXT_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import {
  drawCardEffect,
  restrictEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import {
  chosenCharacterTarget,
  upToTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theyNeverComeBack: LorcanaActionCardDefinition = {
  id: "dtw",
  name: "They Never Come Back",
  characteristics: ["action"],
  text: "Up to 2 chosen characters can't ready at the start of their next turn. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Up to 2 chosen characters can't ready at the start of their next turn. Draw a card.",
      effects: [
        restrictEffect({
          targets: [
            upToTarget({
              target: chosenCharacterTarget,
              upTo: 2,
            }),
          ],
          restriction: "ready",
          duration: DURING_THEIR_NEXT_TURN,
        }),
        drawCardEffect({ targets: [selfPlayerTarget] }),
      ],
    },
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  illustrator: "Javier Salas",
  number: 78,
  set: "008",
  rarity: "common",
};
