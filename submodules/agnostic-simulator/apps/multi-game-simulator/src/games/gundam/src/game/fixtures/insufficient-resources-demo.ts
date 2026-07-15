import { createMockResource, createMockUnit } from "@tcg/gundam-engine";

import { createDevRuntime, type DevRuntime } from "../dev-runtime.ts";

/**
 * Insufficient-resources fixture — viewer holds a cost-3 level-3 Unit
 * with only 2 ready resources. Mirrors the cost/level gating in
 * `packages/engine/src/gundam/moves/core/play-card-shared.test.ts` +
 * `resource-rules.test.ts`.
 *
 * Both gates fail:
 *   - Level requirement (total resource-area cards ≥ card level): 2 < 3
 *   - Cost requirement (active resources ≥ card cost): 2 < 3
 *
 * `enumerateCandidates` runs `validatePlayFromHand` on every hand
 * card and filters this one out, so the simulator's
 * `MatchHandBarContainer` never adds its id to `selectableCardIds`.
 * The click falls through `pickMoveForCard` (no matching move) and
 * nothing happens — which is the behaviour we want to lock in.
 */
export function loadInsufficientResourcesDemo(): DevRuntime {
  return createDevRuntime({
    skipToMainPhase: true,
    p1: {
      hand: [
        createMockUnit({
          cost: 3,
          level: 3,
          ap: 3,
          hp: 5,
          color: "green",
          name: "Gundam GP01",
        }),
      ],
      resourceArea: [createMockResource(), createMockResource()],
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      deck: 30,
      resourceDeck: 10,
    },
  });
}
