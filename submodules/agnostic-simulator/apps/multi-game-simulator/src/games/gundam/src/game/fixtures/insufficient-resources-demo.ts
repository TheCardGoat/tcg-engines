import { gd01WingGundamZero024, gd02GundamX053, st01Gundam001 } from "@tcg/gundam-cards";

import { createDevRuntime, type DevRuntime } from "../dev-runtime.ts";
import { realResourceCards } from "./real-cards.ts";

/**
 * Insufficient-resources fixture — viewer holds three production Units with
 * different colors, levels, costs, and frames, but only 2 ready resources.
 * Mirrors the cost/level gating in
 * `packages/engine/src/gundam/moves/core/play-card-shared.test.ts` +
 * `resource-rules.test.ts`.
 *
 * Both gates fail:
 *   - Level requirement (total resource-area cards ≥ card level): 2 < 3
 *   - Cost requirement (active resources ≥ card cost): 2 < 3
 *
 * `enumerateCandidates` runs `validatePlayFromHand` on every hand
 * card and filters all three out, so the simulator's
 * `MatchHandBarContainer` never adds its id to `selectableCardIds`.
 * The click falls through `pickMoveForCard` (no matching move) and
 * nothing happens — which is the behaviour we want to lock in.
 */
export function loadInsufficientResourcesDemo(): DevRuntime {
  return createDevRuntime({
    skipToMainPhase: true,
    p1: {
      hand: [st01Gundam001, gd01WingGundamZero024, gd02GundamX053],
      resourceArea: realResourceCards(2),
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      deck: 30,
      resourceDeck: 10,
    },
  });
}
