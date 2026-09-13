import { asPlayerId, type PlayerId } from "@tcg/gundam-engine";

import {
  createDevRuntime,
  DEV_PLAYER_ONE,
  DEV_PLAYER_TWO,
  type DevRuntime,
} from "../dev-runtime.ts";
import { attachAutoPassBot } from "./auto-pass.ts";
import {
  realResourceCards,
  st01DemiTrainer008,
  st01Guncannon003,
  st01Guntank004,
} from "./real-cards.ts";

/**
 * Block-step fixture — drops the viewer (player_one) into an active
 * block-step as the *defender*, with the opponent's Guncannon mid-attack
 * against one of the viewer's rested units. Mirrors the Blocker-keyword
 * scenarios at
 * `packages/engine/src/gundam/lifecycle/battle-phase/battle-phase.test.ts:
 * "Battle Phase — <Blocker> keyword required on the blocker (rule 13-1-4)"`.
 *
 * Getting here is non-trivial in a single-seat simulator — the viewer has
 * no UI to drive the opponent's `enterBattle`. We:
 *   1. Flip `initialActivePlayer` to player_two so the engine starts on
 *      opponent's turn.
 *   2. Seat an attacker (Guncannon) + a rested defender target (Guntank) + a
 *      fresh <Blocker> unit (Demi Trainer).
 *   3. Submit the opponent's `enterBattle` synchronously as part of
 *      fixture boot. After `executeCommand` returns the engine is in
 *      `battle-phase / block-step`, viewer is the active player (standby
 *      = defender), and both passBlock and declareBlock are in their
 *      available moves.
 *
 * The opponent's `attachAutoPassBot` still runs so they pass their
 * action-step after the block resolves.
 */
/**
 * Resolve instance ids for a named card in a player's battle area by
 * looking up each instance's definition via `staticResources` and
 * matching on `name`. Returns ids in zone order.
 */
function instanceIdsByName(
  dev: ReturnType<typeof createDevRuntime>,
  playerName: string,
  name: string,
): readonly string[] {
  const state = dev.runtime.getState();
  const zoneKey = `battleArea:${playerName}`;
  const ids = state.ctx.zones.private.zoneCards[zoneKey] ?? [];
  const out: string[] = [];
  for (const id of ids) {
    const mapping = dev.staticResources.cardsMaps.instances.get(id);
    if (!mapping) continue;
    const def = dev.staticResources.getDefinition(mapping.definitionId);
    if (def?.name === name) out.push(id);
  }
  return out;
}

export function loadBlockStepDemo(): DevRuntime {
  const dev = createDevRuntime({
    skipToMainPhase: true,
    initialActivePlayer: DEV_PLAYER_TWO,
    p1: {
      battleArea: [
        // The attack target. Rested so it registers as a legal
        // unit-target per rule 8-1-3 (see `listLegalAttackTargets`).
        {
          card: st01Guntank004,
          exhausted: true,
        },
        // The would-be blocker: active, carries <Blocker>. `canBlock`
        // (rules/derived-state.ts) gates declareBlock on: unit, active,
        // not the attacker's target itself, and keyword present.
        st01DemiTrainer008,
      ],
      resourceArea: realResourceCards(2),
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      battleArea: [st01Guncannon003],
      resourceArea: realResourceCards(2),
      deck: 30,
      resourceDeck: 10,
    },
  });

  // Resolve attacker + target by name — robust to future fixture
  // edits that might reorder or add units in either battle area.
  const p2Units = instanceIdsByName(dev, DEV_PLAYER_TWO, "Guncannon");
  const p1Units = instanceIdsByName(dev, DEV_PLAYER_ONE, "Guntank");
  const attackerId = p2Units[0];
  const targetId = p1Units[0];
  if (!attackerId || !targetId) {
    throw new Error("block-step-demo: failed to resolve attacker/target instance ids");
  }

  const state = dev.runtime.getState();
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

  // Opponent's pass-step coverage after the block resolves (action-step
  // standby-first, then viewer, then damage → main-phase). Same scope
  // caveats as `battle-ready-demo`.
  attachAutoPassBot(dev.runtime, dev.staticResources, DEV_PLAYER_TWO);

  return dev;
}
