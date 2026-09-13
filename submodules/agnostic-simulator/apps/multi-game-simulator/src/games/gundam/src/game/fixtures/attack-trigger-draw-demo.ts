import { gd02GundamBarbatos1stForm054, st03Gouf009 } from "@tcg/gundam-cards";

import { createDevRuntime, DEV_PLAYER_TWO, type DevRuntime } from "../dev-runtime.ts";
import { attachAutoPassBot } from "./auto-pass.ts";
import { realResourceCards } from "./real-cards.ts";

/**
 * 【Attack】 trigger fixture — the viewer's damaged Gundam Barbatos 1st
 * Form draws 1 when it attacks. The staged damage satisfies the printed
 * condition before the attack is declared, so the screen, engine state,
 * and expected result all describe the same real card behavior.
 */
export function loadAttackTriggerDrawDemo(): DevRuntime {
  const dev = createDevRuntime({
    skipToMainPhase: true,
    p1: {
      battleArea: [{ card: gd02GundamBarbatos1stForm054, damage: 1 }],
      resourceArea: realResourceCards(3),
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      battleArea: [
        {
          card: st03Gouf009,
          // Rested so it registers as a legal unit-target per rule
          // 8-1-3 (see `listLegalAttackTargets`). Non-rested would
          // force a direct-attack path which changes the damage
          // shape — we want a clean unit-vs-unit attack so the
          // 【Attack】 draw is the only variable.
          exhausted: true,
        },
      ],
      resourceArea: realResourceCards(2),
      deck: 30,
      resourceDeck: 10,
    },
  });

  attachAutoPassBot(dev.runtime, dev.staticResources, DEV_PLAYER_TWO);
  return dev;
}
