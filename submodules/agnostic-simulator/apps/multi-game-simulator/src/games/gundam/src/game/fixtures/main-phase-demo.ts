import { createDevRuntime, type DevRuntime } from "../dev-runtime.ts";
import {
  realResourceCards,
  realShieldCards,
  st01Gm005,
  st01Guncannon003,
  st01Gundam001,
  st01WhiteBase015,
  st03Gouf009,
} from "./real-cards.ts";

/**
 * Main Phase fixture with production cards and plausible mid-game zones on
 * both sides. The state is injected so tests can start at the interaction
 * under review instead of replaying setup and earlier turns.
 */
export function loadMainPhaseDemo(): DevRuntime {
  return createDevRuntime({
    skipToMainPhase: true,
    p1: {
      hand: [st01Gm005, st01Guncannon003, st01Gundam001],
      battleArea: [st01Guncannon003],
      resourceArea: realResourceCards(3),
      baseSection: [st01WhiteBase015],
      shieldArea: realShieldCards(4),
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      battleArea: [st03Gouf009],
      resourceArea: realResourceCards(2),
      baseSection: [st01WhiteBase015],
      shieldArea: realShieldCards(4),
      deck: 30,
      resourceDeck: 10,
    },
  });
}
