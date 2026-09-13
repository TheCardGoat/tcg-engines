import { createDevRuntime, skipToEndPhaseHandStep, type DevRuntime } from "../dev-runtime.ts";
import { realMainDeckCards, realResourceCards } from "./real-cards.ts";

/**
 * Discard-to-hand-limit fixture — drops the viewer straight into
 * end-phase hand-step with 12 hand cards so the `discardToHandLimit`
 * move (hand limit 10) requires picking 2 to discard. Mirrors the
 * minimal scenario for
 * `packages/engine/src/gundam/moves/core/discard-to-hand-limit.ts`
 * (rule 7-6-5-1).
 *
 * The hand uses twelve distinct production cards so the scenario validates the
 * same visible identities and interaction path used by a real match.
 */
export function loadDiscardLimitDemo(): DevRuntime {
  const dev = createDevRuntime({
    p1: {
      hand: realMainDeckCards(12),
      resourceArea: realResourceCards(1),
      deck: 30,
      resourceDeck: 10,
    },
    p2: { deck: 30, resourceDeck: 10 },
  });

  skipToEndPhaseHandStep(dev.runtime);

  return dev;
}
