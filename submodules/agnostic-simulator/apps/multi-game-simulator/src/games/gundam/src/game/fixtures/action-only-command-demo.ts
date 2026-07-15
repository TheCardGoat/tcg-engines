import { createMockCommand, createMockResource } from "@tcg/gundam-engine";
import type { CardEffect, CommandCard } from "@tcg/gundam-types";

import { createDevRuntime, type DevRuntime } from "../dev-runtime.ts";

/**
 * Action-only command timing fixture — viewer holds a command whose
 * effect only fires at action-step timing (`timing: ["action"]`),
 * while the engine is in main-phase. Rule 3-4-5 gates these: a
 * 【Main】-only or 【Action】-only command must match the current
 * phase. See
 * `packages/engine/src/gundam/moves/core/play-command.ts`
 * (`findPlayableCommandEffect`) + the timing-gating suite in
 * `play-command.test.ts`.
 *
 * `playCommand.enumerateCandidates` runs
 * `findPlayableCommandEffect(def, phase, step)` and skips cards
 * whose effect doesn't match, so the action-only command never
 * lands in `selectableCardIds` during main-phase. Clicking is a
 * no-op from the UI side.
 */
function makeActionOnlyCommand(): CommandCard {
  const effect: CardEffect = {
    type: "command",
    activation: { timing: ["action"] },
    directives: [{ action: { action: "draw", count: 1 } }],
    sourceText: "【Action】 Draw 1.",
  };
  return createMockCommand({
    name: "Tactical Draw",
    cost: 1,
    level: 1,
    effect: effect.sourceText,
    effects: [effect],
  });
}

export function loadActionOnlyCommandDemo(): DevRuntime {
  return createDevRuntime({
    skipToMainPhase: true,
    p1: {
      hand: [makeActionOnlyCommand()],
      resourceArea: [createMockResource(), createMockResource(), createMockResource()],
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      deck: 30,
      resourceDeck: 10,
    },
  });
}
