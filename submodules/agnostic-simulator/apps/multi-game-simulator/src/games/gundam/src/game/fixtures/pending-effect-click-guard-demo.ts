import { createMockResource, createMockUnit } from "@tcg/gundam-engine";

import { createDevRuntime, type DevRuntime } from "../dev-runtime.ts";

/**
 * Regression fixture for rule 5-2 — the click-during-pending-choice gate.
 *
 * Boots into main-phase with:
 *   - P1 (viewer): one active Unit on the battle area (a legal attacker
 *     against the opponent's rested unit), plus one resource so the
 *     board renders normally.
 *   - P2: one rested Unit with HP ≤ 3 sitting in the battle area, so
 *     the viewer's Unit has at least one legal attack target — i.e.
 *     `enterBattle` would be enumerated for the viewer's Unit if no
 *     pending effect were active.
 *
 * The companion RTL spec seeds a `targetSelection` `PendingEffect` via
 * `runTestMutation` and asserts that clicking the viewer's own Unit is
 * a no-op while the prompt is open (the `enterBattle` move is gated
 * out of `enumerateAvailableMovesDetailed` by the rule 5-2 guard in
 * `pending-guards.ts`).
 */
export function loadPendingEffectClickGuardDemo(): DevRuntime {
  return createDevRuntime({
    skipToMainPhase: true,
    p1: {
      battleArea: [createMockUnit({ name: "Viewer Mock", ap: 2, hp: 3 })],
      resourceArea: [createMockResource()],
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      battleArea: [
        { card: createMockUnit({ name: "Rested Mock", ap: 1, hp: 2 }), exhausted: true },
      ],
      deck: 30,
      resourceDeck: 10,
    },
  });
}
