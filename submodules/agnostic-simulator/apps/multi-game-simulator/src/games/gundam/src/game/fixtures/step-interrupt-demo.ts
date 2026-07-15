import { asPlayerId, createMockResource, createMockUnit, type PlayerId } from "@tcg/gundam-engine";

import {
  createDevRuntime,
  DEV_PLAYER_ONE,
  DEV_PLAYER_TWO,
  type DevRuntime,
} from "../dev-runtime.ts";
import { attachAutoPassBot } from "./auto-pass.ts";

/**
 * Step-interrupt fixture — opponent declares attack, then the
 * attacker is forced to trash mid-block-step. Mirrors rule 8-3-5 and
 * the scenario at
 * `packages/engine/src/gundam/lifecycle/battle-phase/battle-phase.test.ts:
 * "8-3-5: attacker destroyed during block step → no damage, return
 * to main-phase"`.
 *
 * Real card effects that can destroy an attacker mid-block-step (e.g.
 * defender's 【When Blocker Declared】 side effects, reactive abilities)
 * don't exist in our mock card pool. The engine's own test uses the
 * `forceToTrash` harness; we reach the same initial state by mutating
 * zones directly after submitting opponent's `enterBattle`.
 *
 * Observable chain once the fixture boots:
 *   1. Viewer is standby in block-step. The attacker is already in
 *      opponent's trash — no combat-active visualisation on the board.
 *   2. PASS BLOCK live.
 *   3. On pass, engine advances to action-step; onEnter detects
 *      broken combat and jumps to battle-end-step → main-phase.
 *   4. Viewer's intended target (GM Jim) has zero damage. Attacker
 *      never returns.
 */
export function loadStepInterruptDemo(): DevRuntime {
  const dev = createDevRuntime({
    skipToMainPhase: true,
    initialActivePlayer: DEV_PLAYER_TWO,
    p1: {
      battleArea: [
        {
          card: createMockUnit({ cost: 1, level: 1, ap: 1, hp: 3, color: "blue", name: "GM Jim" }),
          exhausted: true,
        },
      ],
      resourceArea: [createMockResource()],
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      battleArea: [
        createMockUnit({
          cost: 2,
          level: 2,
          ap: 5,
          hp: 3,
          color: "red",
          name: "Kamikaze Zaku",
        }),
      ],
      resourceArea: [createMockResource(), createMockResource()],
      deck: 30,
      resourceDeck: 10,
    },
  });

  // 1) Submit opponent's enterBattle so pendingCombat is set and
  //    flow enters block-step (same pattern as block-step-demo).
  const state = dev.runtime.getState();
  const p2Field = state.ctx.zones.private.zoneCards[`battleArea:${DEV_PLAYER_TWO}`] ?? [];
  const p1Field = state.ctx.zones.private.zoneCards[`battleArea:${DEV_PLAYER_ONE}`] ?? [];
  const attackerId = p2Field[0];
  const targetId = p1Field[0];
  if (!attackerId || !targetId) {
    throw new Error("step-interrupt-demo: failed to resolve attacker/target ids");
  }
  dev.runtime.executeCommand(
    {
      commandID: crypto.randomUUID(),
      move: "enterBattle",
      prevStateID: state.ctx._stateID,
      actorRole: "player",
      args: { attackerId, target: targetId },
    },
    asPlayerId(DEV_PLAYER_TWO) as PlayerId,
  );

  // 2) Force-move the attacker to opponent's trash. Mirrors the
  //    engine test's `forceToTrash` helper: we're standing in for
  //    any card effect that would destroy an attacker mid-block.
  const afterAttack = dev.runtime.getState();
  const zones = afterAttack.ctx.zones.private;
  const attackerBattleKey = `battleArea:${DEV_PLAYER_TWO}`;
  const trashKey = `trash:${DEV_PLAYER_TWO}`;
  zones.zoneCards[attackerBattleKey] = (zones.zoneCards[attackerBattleKey] ?? []).filter(
    (id) => id !== attackerId,
  );
  zones.zoneCards[trashKey] = [...(zones.zoneCards[trashKey] ?? []), attackerId];
  const idx = zones.cardIndex[attackerId];
  if (idx) {
    zones.cardIndex[attackerId] = {
      ...idx,
      zoneKey: trashKey,
      index: (zones.zoneCards[trashKey]?.length ?? 1) - 1,
    };
  }
  // Update public zone summaries so `zoneCount` mirrors reality.
  const pub = afterAttack.ctx.zones.public;
  if (pub.zoneSummaries[attackerBattleKey]) {
    pub.zoneSummaries[attackerBattleKey].count = Math.max(
      0,
      pub.zoneSummaries[attackerBattleKey].count - 1,
    );
    pub.zoneSummaries[attackerBattleKey].revision++;
  }
  pub.zoneSummaries[trashKey] ??= { revision: 0, count: 0 };
  pub.zoneSummaries[trashKey].count++;
  pub.zoneSummaries[trashKey].revision++;

  attachAutoPassBot(dev.runtime, dev.staticResources, DEV_PLAYER_TWO);
  return dev;
}
