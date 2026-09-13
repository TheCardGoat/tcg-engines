import { st10ZetaGundamEx001 } from "@tcg/gundam-cards";

import { createDevRuntime, DEV_PLAYER_TWO, type DevRuntime } from "../dev-runtime.ts";
import { attachAutoPassBot } from "./auto-pass.ts";
import { realResourceCards, st01Guncannon003, st03Gouf009 } from "./real-cards.ts";

/**
 * Zeta Gundam (EX) starts ready with both of its meaningful target classes
 * available. Attack the opposing player to destroy the single Shield. Zeta
 * becomes active again, but its same-player restriction leaves only the rested
 * enemy Unit as a legal second attack target.
 */
export function loadSt10ShieldAssaultLab(): DevRuntime {
  const dev = createDevRuntime({
    skipToMainPhase: true,
    seed: "st10-shield-assault-lab",
    p1: {
      battleArea: [st10ZetaGundamEx001],
      resourceArea: realResourceCards(7),
      shieldArea: 3,
      deck: 10,
      resourceDeck: 6,
    },
    p2: {
      battleArea: [{ card: st03Gouf009, exhausted: true }],
      resourceArea: realResourceCards(4),
      shieldArea: [st01Guncannon003],
      deck: 10,
      resourceDeck: 6,
    },
  });

  attachAutoPassBot(dev.runtime, dev.staticResources, DEV_PLAYER_TWO);
  return dev;
}
