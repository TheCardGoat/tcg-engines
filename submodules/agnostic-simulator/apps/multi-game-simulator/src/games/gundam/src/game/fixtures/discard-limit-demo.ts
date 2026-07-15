import { createMockResource, createMockUnit } from "@tcg/gundam-engine";

import { createDevRuntime, skipToEndPhaseHandStep, type DevRuntime } from "../dev-runtime.ts";

/**
 * Discard-to-hand-limit fixture — drops the viewer straight into
 * end-phase hand-step with 12 hand cards so the `discardToHandLimit`
 * move (hand limit 10) requires picking 2 to discard. Mirrors the
 * minimal scenario for
 * `packages/engine/src/gundam/moves/core/discard-to-hand-limit.ts`
 * (rule 7-6-5-1).
 *
 * Each card is named uniquely (Unit 01 … Unit 12) so the spec can
 * select specific cards by name rather than by index — less
 * susceptible to MatchHandBar's fan layout / ordering changes.
 */
export function loadDiscardLimitDemo(): DevRuntime {
  const hand = Array.from({ length: 12 }, (_, i) =>
    createMockUnit({
      cost: 1,
      level: 1,
      ap: 1,
      hp: 2,
      color: "blue",
      name: `Unit ${String(i + 1).padStart(2, "0")}`,
    }),
  );
  const dev = createDevRuntime({
    p1: { hand, resourceArea: [createMockResource()], deck: 30, resourceDeck: 10 },
    p2: { deck: 30, resourceDeck: 10 },
  });

  skipToEndPhaseHandStep(dev.runtime);

  return dev;
}
