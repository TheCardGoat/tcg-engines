/**
 * DDD006 Cutting Couriers — Warrior Legs d0.
 * Printed: When your sword attack hits, you may destroy this. If you do,
 * the attack gets go again.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, parryBlade } from "../../../fixtures.ts";

const LIFE = 20;

function drain(game: ReturnType<typeof FabTestEngine.start>, accept = true): void {
  for (let s = 0; s < 96; s += 1) {
    const d = game.getState().decision;
    if (d?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: d.actorId,
        payload: {
          decisionId: d.decisionId,
          stateVersion: d.stateVersion,
          answer: { kind: "boolean", value: accept },
        },
      });
      continue;
    }
    if (d?.kind === "entity-target") {
      const pick = d.candidates[0];
      if (!pick && (d.min ?? 1) > 0) break;
      game.exec({
        move: "answer-decision",
        actorId: d.actorId,
        payload: {
          decisionId: d.decisionId,
          stateVersion: d.stateVersion,
          answer: { kind: "entity-target", instanceIds: pick ? [pick.instanceId] : [] },
        },
      });
      continue;
    }
    if (d?.kind === "payment") {
      const pick = d.candidates[0];
      game.exec({
        move: "answer-decision",
        actorId: d.actorId,
        payload: {
          decisionId: d.decisionId,
          stateVersion: d.stateVersion,
          answer: { kind: "payment", instanceIds: pick ? [pick.instanceId] : [] },
        },
      });
      continue;
    }
    if (d) break;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    if (game.declareNoDefenseIfPending()) continue;
    const prio = game.getPriorityPlayerId();
    if (prio) {
      try {
        game.exec({ move: "pass", actorId: prio, payload: {} });
      } catch {
        return;
      }
      continue;
    }
    return;
  }
}

import { cuttingCouriers } from "../../../../../../cards/src/cards/equipment/cutting-couriers.ts";

describe("cutting-couriers (DDD006)", () => {
  it("core: sword hit → destroy → attack gets go again (AP refund)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [parryBlade],
        legs: [cuttingCouriers],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    // Activate Parry Blade (1H Sword, 2-power, 1{r}).
    Bravo.activate(parryBlade);
    drain(game, true);
    // Combat resolved — sword hit → optional destroy → go again.

    // Legs destroyed → GY.
    expect(Bravo.zone("legs")).not.toContain(cuttingCouriers.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(cuttingCouriers.canonicalId);
    // Go again: AP refunded (1 spent on attack, 1 refunded = 1 AP remaining).
    expect(Bravo.actionPoints()).toBe(1);
  });

  it("boundary: decline → legs stay; no go again (AP spent)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [parryBlade],
        legs: [cuttingCouriers],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(parryBlade);
    drain(game, false); // decline the optional destroy.

    // Legs stay.
    expect(Bravo.zone("legs")).toContain(cuttingCouriers.canonicalId);
    // No go again — AP spent on attack (1 → 0).
    expect(Bravo.actionPoints()).toBe(0);
  });
});
