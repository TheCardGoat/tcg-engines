import { createMockCommand, createMockResource, createMockUnit } from "@tcg/gundam-engine";
import type { CardEffect, CommandCard } from "@tcg/gundam-types";

import { createDevRuntime, type DevRuntime } from "../dev-runtime.ts";

/**
 * Play-command multi-target fixture — a "rest 1 enemy Unit" command
 * with TWO legal targets on the opponent's side. The engine's
 * effect executor raises a `targetSelection` pending-choice prompt
 * after Confirm, and the `PlayerSeatContainer` Priority-1 click
 * handler routes the clicked card through `resolveEffect`.
 *
 * Mirrors the "user-chosen targets honored" slice of
 * `packages/engine/src/gundam/moves/core/play-command.test.ts`
 * — the engine's own test verifies the executor respects explicit
 * `targets`; this fixture lets us assert the same via the UI
 * targeting click-path.
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

export function loadCommandMultiTargetDemo(): DevRuntime {
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
        createMockUnit({ cost: 3, level: 3, ap: 3, hp: 5, color: "purple", name: "Dom" }),
      ],
      deck: 30,
      resourceDeck: 10,
    },
  });
}
