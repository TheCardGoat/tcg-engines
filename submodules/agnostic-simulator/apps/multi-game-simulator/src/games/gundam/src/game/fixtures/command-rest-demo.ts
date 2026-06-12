import { createMockCommand, createMockResource, createMockUnit } from "@tcg/gundam-engine";
import type { CardEffect, CommandCard } from "@tcg/gundam-types";

import { createDevRuntime, type DevRuntime } from "../dev-runtime.ts";

/**
 * Play-command fixture — drops the viewer into main-phase with a cost-1
 * command in hand that rests one enemy Unit, and an opponent Unit on the
 * board for it to target. Mirrors the `makeRestCommand({ timing: ["main"] })`
 * helper used by
 * `packages/engine/src/gundam/moves/core/play-command.test.ts`.
 *
 * A default `createMockCommand()` ships with no `effects`, so
 * `findPlayableCommandEffect` (see `play-command.ts`) rejects it. We
 * attach a real command effect with a "main" timing + a single-target
 * opponent-unit directive so the engine surfaces `playCommand` in the
 * viewer's available moves and drives a target-selection step.
 */
function makeRestCommand(): CommandCard {
  const effect: CardEffect = {
    type: "command",
    activation: { timing: ["main"] },
    directives: [
      {
        action: {
          action: "rest",
          target: {
            owner: "opponent",
            cardType: "unit",
            count: 1,
          },
        },
      },
    ],
    sourceText: "Rest 1 enemy Unit.",
  };
  return createMockCommand({
    name: "Stand By",
    cost: 1,
    level: 1,
    effect: effect.sourceText,
    effects: [effect],
  });
}

export function loadCommandRestDemo(): DevRuntime {
  return createDevRuntime({
    skipToMainPhase: true,
    p1: {
      hand: [makeRestCommand()],
      resourceArea: [createMockResource(), createMockResource(), createMockResource()],
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      battleArea: [
        createMockUnit({ cost: 2, level: 2, ap: 2, hp: 4, color: "red", name: "Zaku II" }),
      ],
      deck: 30,
      resourceDeck: 10,
    },
  });
}
