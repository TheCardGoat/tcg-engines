import { createMockPilot, createMockResource, createMockUnit } from "@tcg/gundam-engine";

import { createDevRuntime, type DevRuntime } from "../dev-runtime.ts";

/**
 * Pilot-pairing fixture — drops the viewer into main-phase with one cost-1
 * pilot in hand and one pairable Unit on the battle area. Mirrors the
 * scenario in `packages/engine/src/gundam/moves/core/pilot-trigger-routing.test.ts`:
 * `assignPilot` needs both a legal pilot source (hand, cost payable) and a
 * pairable unit (no other pilot already attached).
 *
 * Kept separate from `main-phase-demo` (which three existing specs rely on
 * for a predictable 3-card hand) so swapping the hand composition here
 * doesn't drag those specs along.
 */
export function loadPilotPairDemo(): DevRuntime {
  return createDevRuntime({
    skipToMainPhase: true,
    p1: {
      hand: [createMockPilot({ cost: 1, level: 1, apBonus: 1, hpBonus: 1, name: "Amuro Ray" })],
      battleArea: [
        createMockUnit({ cost: 2, level: 2, ap: 2, hp: 4, color: "white", name: "Guncannon" }),
      ],
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
