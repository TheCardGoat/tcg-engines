/**
 * MPW008 Durendal — Warrior Sword 2H — power 3.
 *
 * Printed:
 *   a1: Once per Turn Action - {r}: Attack
 *   a2: If this has a +1{p} counter, reaction cards get -1{d} while
 *       defending it.
 *
 * Status: 🟡→✅ — a1 proven @ weapon-pure-opt-attack; a2 proven here: with a
 * +1{p} counter seeded on the weapon, a Defense Reaction defending the
 * attack gets -1{d} (Flic Flak d3 → d2; 4-power attack deals 4-2=2);
 * without the counter the reaction defends at printed d (3-power attack
 * vs d3 = 0 damage); a non-reaction defender is unaffected.
 * Card fix: a2 target filter `types:["Reaction"]` (never matches — real
 * type-lines are "Attack Reaction"/"Defense Reaction") → or AR|DR, the
 * OUT005 nerve-scalpel family pattern (§7 FIXED 2026-08-08).
 *
 * The fixture declares `powerCounterTotal: 1` as its Arrange step (the
 * printed source of +1{p} counters is other cards, e.g. Sharpen family);
 * the a2 continuous condition `has-counter` reads it and the numeric counter
 * also raises the attack power to 4 (standard engine numeric-counter
 * application).
 *
 * Flow: default harness stops at the defend step after activation; walk
 * pass → pass into the reaction step (CR 7.4.2, turn player first), then
 * the opponent plays the Defense Reaction (CR 7.3.2a — DRs are played,
 * not declared). Modeled on the proven nerve-scalpel reaction-step flow.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";

import { durendal } from "../../../../../../cards/src/cards/weapons/durendal.ts";
import { flicFlakYellow } from "../../../../../../cards/src/cards/defense-reactions/flic-flak.ts";
import { rattleBonesRed } from "../../../../../../cards/src/cards/actions/rattle-bones.ts";

const LIFE = 40;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 64; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "ordering") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "ordering", orderedIds: decision.entries.map((entry) => entry.id) },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      const pick = decision.candidates[0];
      if (!pick && (decision.min ?? 1) > 0) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: pick ? [pick.instanceId] : [] },
        },
      });
      continue;
    }
    if (decision && game.answerForcedDecision()) continue;
    if (decision) break;
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

/**
 * Walk a weapon activation to the Reaction Step and have the opponent play a
 * Defense Reaction. With autoPassPriority:false the combat needs explicit
 * passes: the activation resolves through the stack first, then the attack
 * step, then the defend step (DRs cannot be DECLARED, CR 7.3.2a — the defend
 * step passes without a declared defender), then the reaction step opens with
 * the turn player first (CR 7.4.2). Robust loop: pass while a priority holder
 * exists and the combat has not reached the reaction step.
 */
function attackWithReactionDefense(
  game: ReturnType<typeof FabTestEngine.start>,
  bravoHandle: ReturnType<ReturnType<typeof FabTestEngine.start>["as"]>,
  oppHandle: ReturnType<ReturnType<typeof FabTestEngine.start>["as"]>,
  reaction: Parameters<ReturnType<ReturnType<typeof FabTestEngine.start>["as"]>["play"]>[0],
): void {
  const Bravo = bravoHandle;
  const Opp = oppHandle;
  for (let safety = 0; safety < 16 && game.combat()?.step !== "reaction"; safety += 1) {
    if (game.declareNoDefenseIfPending()) continue;
    const prio = game.getPriorityPlayerId();
    if (!prio) break;
    game.exec({ move: "pass", actorId: prio, payload: {} });
  }
  expect(game.combat()?.step).toBe("reaction");
  // reaction step: turn player (Bravo) holds priority first (CR 7.4.2).
  Bravo.pass();
  expect(game.getState().priority?.holderPlayerId).toBe(Opp.id);
  Opp.play(reaction);
  drain(game);
}

describe("durendal (MPW008)", () => {
  it("a2: with a +1{p} counter, a defending reaction gets -1{d} (d3 → d2)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [{ card: durendal, state: { powerCounterTotal: 1 } }],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [flicFlakYellow], resourcePoints: 0, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    // Fixture's +1{p} counter raises attack power 3 → 4.

    Bravo.activate(durendal);
    attackWithReactionDefense(game, Bravo, Opp, flicFlakYellow);

    // 4-power attack vs d3−1 = d2 → 2 damage.
    expect(Opp.life()).toBe(lifeBefore - 2);
  });

  it("a2 boundary: without the counter, the reaction defends at printed d (0 damage)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [durendal],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [flicFlakYellow], resourcePoints: 0, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    Bravo.activate(durendal);
    attackWithReactionDefense(game, Bravo, Opp, flicFlakYellow);

    // 3-power attack vs printed d3 → 0 damage (no debuff).
    expect(Opp.life()).toBe(lifeBefore);
  });

  it("a2 boundary: a non-reaction defender gets NO debuff", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [{ card: durendal, state: { powerCounterTotal: 1 } }],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [rattleBonesRed], resourcePoints: 0, deck: 6 },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    // The fixture counter makes the a2 condition hold, but Rattle Bones is
    // an attack ACTION, not a reaction → full printed d3 blocks.

    Bravo.activate(durendal);
    expect(game.combat()?.step).toBe("defend");
    Opp.defendWith(rattleBonesRed);
    drain(game);

    // 4-power attack vs d3 → 1 damage (no -1{d} on a non-reaction card).
    expect(Opp.life()).toBe(lifeBefore - 1);
  });

  it("a1 boundary: once per turn — second activation in the same turn is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [durendal],
        hand: [],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(durendal);
    game.helpers.resolveRestOfCombat();
    expect(() => Bravo.activate(durendal)).toThrow();
  });
});
