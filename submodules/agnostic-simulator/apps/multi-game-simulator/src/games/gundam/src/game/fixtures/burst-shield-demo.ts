import { asPlayerId, createMockResource, createMockUnit, type PlayerId } from "@tcg/gundam-engine";
import type { CardEffect } from "@tcg/gundam-types";

import {
  createDevRuntime,
  DEV_PLAYER_ONE,
  DEV_PLAYER_TWO,
  type DevRuntime,
} from "../dev-runtime.ts";
import { attachAutoPassBot } from "./auto-pass.ts";

/**
 * 【Burst】-on-shield-destruction fixture — opponent direct-attacks
 * the viewer. The viewer's shield carries 【Burst】 Draw 1, so when
 * the direct hit breaks it the burst effect fires for the viewer.
 * Mirrors the burst-effect setup in
 * `packages/engine/src/gundam/lifecycle/battle-phase/battle-phase.test.ts:
 * "13-1-7-4: Suppression fires Burst effects for both destroyed shields"`
 * but for a single non-Suppression direct attack.
 *
 * Why viewer-as-defender: the burst effect resolves for the shield's
 * owner. If the viewer is the attacker the burst would resolve for
 * the opponent, and the observable (hand +1) isn't exposed to the
 * viewer's UI in a testable form. Flipping to defender puts the
 * draw into the viewer's own hand listitem count.
 *
 * Plumbing mirrors `block-step-demo`:
 *   1. initialActivePlayer = player_two (opponent).
 *   2. skipToMainPhase to land on opponent's turn.
 *   3. Execute opponent's `enterBattle({ target: "direct" })` as
 *      part of fixture boot — the viewer has no battle units, so
 *      rule 8-1-3 allows the direct attack.
 *   4. attachAutoPassBot on player_two so the action-step advances
 *      once viewer passes block.
 */
export function loadBurstShieldDemo(): DevRuntime {
  const burstDraw: CardEffect = {
    type: "triggered",
    activation: { timing: ["burst"] },
    directives: [{ action: { action: "draw", count: 1 } }],
    sourceText: "【Burst】 Draw 1.",
  };
  const burstShield = createMockUnit({
    ap: 1,
    hp: 1,
    color: "blue",
    name: "Burst Shield",
    effects: [burstDraw],
  });

  const dev = createDevRuntime({
    skipToMainPhase: true,
    initialActivePlayer: DEV_PLAYER_TWO,
    p1: {
      // No battle-area units — so opponent's direct attack is legal
      // per rule 8-1-3 without needing <High-Maneuver>.
      resourceArea: [createMockResource()],
      // A single burst shield, plus deck cards so the burst draw has
      // something to pull.
      shieldArea: [burstShield],
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      battleArea: [
        createMockUnit({ cost: 2, level: 2, ap: 2, hp: 4, color: "red", name: "Zaku II" }),
      ],
      resourceArea: [createMockResource(), createMockResource()],
      deck: 30,
      resourceDeck: 10,
    },
  });

  // Find opponent's attacker id and submit the direct attack.
  const state = dev.runtime.getState();
  const p2Field = state.ctx.zones.private.zoneCards[`battleArea:${DEV_PLAYER_TWO}`] ?? [];
  const attackerId = p2Field[0];
  if (!attackerId) {
    throw new Error("burst-shield-demo: failed to resolve opponent attacker id");
  }

  dev.runtime.executeCommand(
    {
      commandID: crypto.randomUUID(),
      move: "enterBattle",
      prevStateID: state.ctx._stateID,
      actorRole: "player",
      args: { attackerId, target: "direct" },
    },
    asPlayerId(DEV_PLAYER_TWO) as PlayerId,
  );

  attachAutoPassBot(dev.runtime, dev.staticResources, DEV_PLAYER_TWO);
  return dev;
}

// Keep DEV_PLAYER_ONE imported — used implicitly by tooling to
// ensure both player-id constants stay in scope for parity with the
// block-step fixture.
void DEV_PLAYER_ONE;
