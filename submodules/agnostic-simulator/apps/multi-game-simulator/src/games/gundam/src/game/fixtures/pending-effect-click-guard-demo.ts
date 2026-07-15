import { createMockResource, createMockUnit } from "@tcg/gundam-engine";
import { gd04OverwhelmingPressure109, st04StrikerPack012 } from "@tcg/gundam-cards";

import { createDevRuntime, type DevRuntime } from "../dev-runtime.ts";

/**
 * Regression fixture for rule 5-2 — the click-during-pending-choice gate.
 *
 * Boots into main-phase with:
 *   - P1 (viewer): GD04-109 Overwhelming Pressure in hand, enough active
 *     resources to play it, and one active Unit on the battle area (a legal
 *     attacker against the opponent's rested unit).
 *   - P2: one rested Lv.2 Unit sitting in the battle area, so it is both a
 *     legal Overwhelming Pressure target and a legal attack target — i.e.
 *     `enterBattle` would be enumerated for the viewer's Unit if no pending
 *     effect were active.
 *
 * The companion RTL spec legally plays Overwhelming Pressure to open its
 * target prompt, then asserts that clicking the viewer's own Unit is a no-op
 * while the prompt is open.
 */
export function loadPendingEffectClickGuardDemo(): DevRuntime {
  return createDevRuntime({
    skipToMainPhase: true,
    p1: {
      hand: [gd04OverwhelmingPressure109],
      battleArea: [createMockUnit({ name: "Viewer Mock", ap: 2, hp: 3 })],
      resourceArea: Array.from({ length: 5 }, () => createMockResource()),
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      battleArea: [
        {
          card: createMockUnit({ name: "Rested Mock", level: 2, ap: 1, hp: 6 }),
          exhausted: true,
        },
      ],
      deck: 30,
      resourceDeck: 10,
    },
  });
}

/** A legal ST04-012 main-phase choice between its two printed Unit tokens. */
export function loadStrikerPackChoiceDemo(): DevRuntime {
  return createDevRuntime({
    skipToMainPhase: true,
    p1: {
      hand: [st04StrikerPack012],
      resourceArea: Array.from({ length: 5 }, () => createMockResource()),
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      deck: 30,
      resourceDeck: 10,
    },
  });
}
