import { createDevRuntime, type DevRuntime } from "../dev-runtime.ts";
import {
  realResourceCards,
  st01AmuroRay010,
  st01Guncannon003,
  st01Gundam001,
  st01SulettaMercury011,
} from "./real-cards.ts";

/**
 * Two production Pilots and two pairable production Units let QA exercise
 * linked and non-linked pairing paths. Mirrors the
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
      hand: [st01AmuroRay010, st01SulettaMercury011],
      battleArea: [st01Gundam001, st01Guncannon003],
      resourceArea: realResourceCards(5),
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      deck: 30,
      resourceDeck: 10,
    },
  });
}
