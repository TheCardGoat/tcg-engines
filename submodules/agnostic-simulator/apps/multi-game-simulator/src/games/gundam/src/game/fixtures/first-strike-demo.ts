import { gd05DestinyGundam055, st01Guncannon003 } from "@tcg/gundam-cards";

import { createDevRuntime, DEV_PLAYER_TWO, type DevRuntime } from "../dev-runtime.ts";
import { attachAutoPassBot } from "./auto-pass.ts";
import { realResourceCards } from "./real-cards.ts";

/**
 * <First Strike> keyword fixture — viewer has a FirstStrike attacker
 * with enough AP to one-shot the opponent's lone unit. Mirrors
 * `packages/engine/src/gundam/lifecycle/battle-phase/battle-phase.test.ts`
 * First-Strike scenarios (rule 13-1-5-2): attacker's damage resolves
 * before the target's counter-damage, so a lethal hit kills the target
 * and the attacker takes no counter.
 *
 * Destiny Gundam's 5 AP vs Guncannon's 4 HP means the target is defeated
 * by First Strike and Destiny Gundam receives no counter-damage.
 */
export function loadFirstStrikeDemo(): DevRuntime {
  const dev = createDevRuntime({
    skipToMainPhase: true,
    p1: {
      battleArea: [gd05DestinyGundam055],
      resourceArea: realResourceCards(3),
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      battleArea: [
        {
          card: st01Guncannon003,
          // Exhausted so it registers as a legal unit-target (rule
          // 8-1-3 — targets must be rested).
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
