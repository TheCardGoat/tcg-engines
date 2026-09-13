/**
 * Hand-authored AAA for Chest equipment with printed abilities that follow
 * proven engine paths (destroy-self Instant, hit-trigger optional destroy).
 *
 * Each card module was read end-to-end; scenarios assert the printed happy
 * path plus ability-specific boundaries. No lifecycle theater, no script dumps.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";

import { threadbareTunic } from "../../../../../../cards/src/cards/equipment/threadbare-tunic.ts";
import { vestOfTheFirstFist } from "../../../../../../cards/src/cards/equipment/vest-of-the-first-fist.ts";

/**
 * Walk combat / stack, answering the first boolean/optional decision with
 * `accept`, then auto-passing the rest. Ensures hit-trigger optionals fire
 * exactly once while combat still resolves cleanly.
 */
function resolveWithOptional(game: ReturnType<typeof FabTestEngine.start>, accept: boolean): void {
  let answered = false;
  for (let safety = 0; safety < 64; safety += 1) {
    const decision = game.getState().decision;
    if (!answered && decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: accept },
        },
      });
      answered = true;
      continue;
    }
    if (decision?.kind === "ordering") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "ordering" as const,
            orderedIds: decision.entries.map((entry) => entry.id),
          },
        },
      });
      continue;
    }
    if (decision) {
      throw new Error(`unexpected decision kind: ${decision.kind}`);
    }
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    if (game.declareNoDefenseIfPending()) continue;
    const prio = game.getPriorityPlayerId();
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

// ---------------------------------------------------------------------------
// AZL005 threadbare-tunic — Generic Chest d0
// Instant - Destroy Threadbare Tunic: Gain {r}.
// Activate this ability only if you have no cards in hand.
//
// Reasoning:
// - abilityType Instant: no Action Point cost to activate.
// - Cost is destroy-self (equipment leaves chest immediately as cost).
// - Effect is +1 resource point.
// - Condition gate: zone-count hand controller eq 0. Without empty hand the
//   activate move must be rejected.
// - After destroy, a second activate is illegal (card is gone).
// ---------------------------------------------------------------------------

describe("threadbare-tunic (AZL005)", () => {
  it("core mechanic: Instant destroy-self with empty hand gains 1 resource", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [threadbareTunic],
        hand: [],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    expect(Bravo.zone("chest")).toContain(threadbareTunic.canonicalId);

    Bravo.activate(threadbareTunic);
    game.passBoth();

    expect(Bravo.zone("chest")).not.toContain(threadbareTunic.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(threadbareTunic.canonicalId);
    expect(Bravo.resourcePoints()).toBe(1);
  });

  it("boundaries: activate is illegal when hand is not empty", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [threadbareTunic],
        hand: [snatchRed],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    expect(() => Bravo.activate(threadbareTunic)).toThrow();
    // Equipment stays because the condition gate rejected the activate.
    expect(Bravo.zone("chest")).toContain(threadbareTunic.canonicalId);
  });

  it("boundaries: after destroy, activate is no longer legal", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [threadbareTunic],
        hand: [],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(threadbareTunic);
    game.passBoth();

    expect(() => Bravo.activate(threadbareTunic)).toThrow();
  });
});

// ---------------------------------------------------------------------------
// ARC152 vest-of-the-first-fist — Generic Chest d0
// When an attack action card you control hits, you may destroy Vest of the
// First Fist. If you do, gain {r}{r}.
//
// Reasoning:
// - Triggered static: hit event from an Action+Attack card controlled by you.
// - Optional: you may destroy; declining keeps the equipment and grants nothing.
// - Happy path: play Snatch (AAC), opponent does not defend, hit fires,
//   accept the optional destroy → chest → GY, gain 2 RP.
// - Decline boundary: same setup but decline → equipment stays, RP unchanged.
// ---------------------------------------------------------------------------

describe("vest-of-the-first-fist (ARC152)", () => {
  it("core mechanic: AAC hit → optional destroy → gain 2 resources", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [vestOfTheFirstFist],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    // Play the attack action card; opponent does not defend, so the attack
    // hits. resolveWithOptional accepts the triggered destroy.
    Bravo.attackWith(snatchRed);
    const rpAfterAttack = Bravo.resourcePoints();
    resolveWithOptional(game, true);

    expect(Bravo.zone("chest")).not.toContain(vestOfTheFirstFist.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(vestOfTheFirstFist.canonicalId);
    // gain {r}{r} = +2 resource points from the printed ability.
    expect(Bravo.resourcePoints()).toBeGreaterThanOrEqual(rpAfterAttack + 2);
  });

  it("boundaries: declining the optional keeps the equipment and grants no resources", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [vestOfTheFirstFist],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed);
    const rpBefore = Bravo.resourcePoints();
    resolveWithOptional(game, false);

    // Equipment stays; no resource gain.
    expect(Bravo.zone("chest")).toContain(vestOfTheFirstFist.canonicalId);
    expect(Bravo.resourcePoints()).toBe(rpBefore);
  });
});
