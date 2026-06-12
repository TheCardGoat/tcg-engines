import { createMockResource, createMockUnit } from "@tcg/gundam-engine";

import { createDevRuntime, DEV_PLAYER_TWO, type DevRuntime } from "../dev-runtime.ts";
import { attachAutoPassBot } from "./auto-pass.ts";

/**
 * Battle-ready fixture — drops the viewer into main-phase with at least one
 * legal attack available. Mirrors `main-phase-demo` but marks the opponent's
 * on-board unit as `exhausted: true` so it registers as a "rested" enemy
 * target per rule 8-1-3 (see
 * `packages/engine/src/gundam/moves/core/enter-battle.ts`, `listLegalAttackTargets`).
 *
 * Without the exhausted flag the attacker has no legal unit to attack and no
 * direct-attack path (opponent still has units in play, no <High-Maneuver>),
 * so the engine filters it out of `selectableCardIds` and the click-path
 * into the attack overlay is unreachable from `main-phase-demo`.
 *
 * Kept separate from `main-phase-demo` so existing specs (card-inspect,
 * card-link-hover, deploy-unit) that rely on the pristine demo state don't
 * have to absorb the change.
 */
export function loadBattleReadyDemo(): DevRuntime {
  const dev = createDevRuntime({
    skipToMainPhase: true,
    p1: {
      hand: [createMockUnit({ cost: 1, level: 1, ap: 2, hp: 3, color: "blue", name: "RX-78-2" })],
      battleArea: [
        createMockUnit({ cost: 2, level: 2, ap: 2, hp: 4, color: "white", name: "Guncannon" }),
      ],
      resourceArea: [createMockResource(), createMockResource(), createMockResource()],
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      battleArea: [
        {
          card: createMockUnit({ cost: 3, level: 3, ap: 3, hp: 5, color: "purple", name: "Dom" }),
          exhausted: true,
        },
      ],
      resourceArea: [createMockResource(), createMockResource()],
      deck: 30,
      resourceDeck: 10,
    },
  });

  // Opponent has no UI presence in a single-seat simulator, so their
  // pass-step moves (passBlock / passBattleAction / passActionStep) have
  // to be submitted by a local helper for the battle flow to advance.
  attachAutoPassBot(dev.runtime, dev.staticResources, DEV_PLAYER_TWO);

  return dev;
}
