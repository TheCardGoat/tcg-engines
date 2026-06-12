import { createMockResource, createMockUnit } from "@tcg/gundam-engine";

import { createDevRuntime, DEV_PLAYER_TWO, type DevRuntime } from "../dev-runtime.ts";
import { attachAutoPassBot } from "./auto-pass.ts";

/**
 * <Suppression> keyword fixture — viewer has a Suppression attacker and
 * the opponent has no units in play (so direct attack is freely
 * available per rule 8-1-3) plus a full stack of 6 shields. Mirrors
 * `packages/engine/src/gundam/lifecycle/battle-phase/battle-phase.test.ts`
 * Suppression scenarios (rule 13-1-7): on a direct attack, Suppression
 * removes TWO shields from the top of the stack, firing Burst effects
 * on both.
 *
 * We don't seed `【Burst】` shields here — the simulator doesn't yet
 * render burst-triggered effects with a unique UI signal (no
 * destroy-animation, no trigger-queue banner), and asserting on the
 * sim's burst-resolution UI is premature. The observable we do assert
 * on is the shield count: 6 → 4, rather than the 6 → 5 you'd see
 * without Suppression.
 */
export function loadSuppressionDemo(): DevRuntime {
  const dev = createDevRuntime({
    skipToMainPhase: true,
    p1: {
      battleArea: [
        createMockUnit({
          cost: 3,
          level: 3,
          ap: 3,
          hp: 4,
          color: "blue",
          name: "Gundam Supp",
          keywordEffects: [{ keyword: "Suppression" }],
        }),
      ],
      resourceArea: [createMockResource(), createMockResource(), createMockResource()],
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      // No battleArea — rule 8-1-3 makes direct attack legal for any
      // attacker when opponent has no units in play, so we don't need
      // HighManeuver to reach the direct path.
      resourceArea: [createMockResource(), createMockResource()],
      deck: 30,
      resourceDeck: 10,
      // Full 6-shield stack. `skipToMainPhase` bypasses the setup
      // phase's shield-fill, so without this the opponent has zero
      // shields and the direct attack would hit the base instead.
      shieldArea: 6,
    },
  });

  attachAutoPassBot(dev.runtime, dev.staticResources, DEV_PLAYER_TWO);
  return dev;
}
