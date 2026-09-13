import { st07ArmedIntervention013 } from "@tcg/gundam-cards";

import { createDevRuntime, type DevRuntime } from "../dev-runtime.ts";
import { realResourceCards } from "./real-cards.ts";

/**
 * Action-only command timing fixture using ST07-013 Armed Intervention while
 * the engine is in main-phase. Rule 3-4-5 gates these: an
 * 【Main】-only or 【Action】-only command must match the current
 * phase. See
 * `packages/engine/src/gundam/moves/core/play-command.ts`
 * (`findPlayableCommandEffect`) + the timing-gating suite in
 * `play-command.test.ts`.
 *
 * Four resources satisfy its level and cost so timing is the only reason the
 * card is unavailable.
 */
export function loadActionOnlyCommandDemo(): DevRuntime {
  return createDevRuntime({
    skipToMainPhase: true,
    p1: {
      hand: [st07ArmedIntervention013],
      resourceArea: realResourceCards(4),
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      deck: 30,
      resourceDeck: 10,
    },
  });
}
