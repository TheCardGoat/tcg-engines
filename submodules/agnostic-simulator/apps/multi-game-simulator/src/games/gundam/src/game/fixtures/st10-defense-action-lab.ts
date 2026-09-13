import {
  st10DiffuseBeamCannon015,
  st10GrazeDuelType009,
  st10LunaManaCarryBase016,
  st10MobileWorkerTekkadan010,
} from "@tcg/gundam-cards";
import { asPlayerId, type PlayerId } from "@tcg/gundam-engine";

import { createDevRuntime, DEV_PLAYER_TWO, type DevRuntime } from "../dev-runtime.ts";
import { attachAutoPassBot } from "./auto-pass.ts";
import { realResourceCards, st01Guncannon003, st01Guntank004 } from "./real-cards.ts";

/**
 * Viewer-owned defensive fork starting in the Block Step.
 *
 * Branch A declares Graze Duel Type or Mobile Worker as the Blocker, then
 * plays Diffuse Beam Cannon in the Action Step to reduce the attacker.
 * Branch B passes Block, plays or passes the Action Step, and lets the direct
 * hit reveal Luna Mana & Carry Base so its Burst and Deploy sequence can be
 * inspected. Restart switches cleanly between the branches.
 */
export function loadSt10DefenseActionLab(): DevRuntime {
  const dev = createDevRuntime({
    skipToMainPhase: true,
    initialActivePlayer: DEV_PLAYER_TWO,
    seed: "st10-defense-action-lab",
    // Keep the deterministic visual lab usable during a long validation
    // session; production-like dynamic clocks otherwise run below zero while
    // a tester pauses to inspect prompts, logs, and animations.
    clockReserveMs: 60 * 60 * 1_000,
    p1: {
      hand: [st10DiffuseBeamCannon015],
      battleArea: [{ card: st10GrazeDuelType009, damage: 1 }, st10MobileWorkerTekkadan010],
      resourceArea: realResourceCards(3),
      shieldArea: [st10LunaManaCarryBase016, st01Guntank004],
      deck: 10,
      resourceDeck: 6,
    },
    p2: {
      battleArea: [st01Guncannon003],
      resourceArea: realResourceCards(4),
      shieldArea: 3,
      deck: 10,
      resourceDeck: 6,
    },
  });

  const state = dev.runtime.getState();
  const attackerId = state.ctx.zones.private.zoneCards[`battleArea:${DEV_PLAYER_TWO}`]?.[0];
  if (!attackerId) {
    throw new Error("st10-defense-action-lab: failed to resolve the attacking Unit");
  }

  const result = dev.runtime.executeCommand(
    {
      commandID: crypto.randomUUID(),
      move: "enterBattle",
      prevStateID: state.ctx._stateID,
      actorRole: "player",
      args: { attackerId, target: "direct" },
    },
    asPlayerId(DEV_PLAYER_TWO) as PlayerId,
  );
  if (!result.success) {
    throw new Error(`st10-defense-action-lab: failed to enter battle (${result.error})`);
  }

  attachAutoPassBot(dev.runtime, dev.staticResources, DEV_PLAYER_TWO);
  return dev;
}
