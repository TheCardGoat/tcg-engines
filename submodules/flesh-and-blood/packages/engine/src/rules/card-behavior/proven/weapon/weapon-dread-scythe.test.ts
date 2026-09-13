/**
 * MON229 Dread Scythe — Runeblade Scythe 2H — power 3, arcane 1.
 *
 * Printed:
 *   a1: Once per Turn Action - {r}{r}{r}: Attack
 *   a2: Whenever you attack with Dread Scythe, deal 1 arcane damage to the
 *       defending hero.
 *   a3: A hero dealt damage by Dread Scythe can't gain {h} during their next
 *       action phase.
 *
 * Reasoning (hand-authored):
 * 1. a1 (3{r} 3{p}+1 arcane OPT attack) proven @ weapon-pilots2; this file
 *    proves the a2 arcane-on-attack clause.
 * 2. a2 is a static trigger on `attack` (name filter "Dread Scythe") →
 *    deal 1 arcane to the defending hero (wired `defending-hero` selector).
 *    KEY BEHAVIOR: the arcane lands EVEN IF the physical is fully blocked.
 * 3. Happy (undefended): 3 physical + 1 arcane = 4. Blocked boundary: a d3
 *    defender stops the physical but the 1 arcane still resolves → 1.
 * 4. a3 (can't gain life during next action phase) — `rule-modification`
 *    restrict `gain-life` is NOT wired in the engine (CRU140 same gap) →
 *    honest §7 OPEN row; card stays 🟡.
 *
 * Status: 🟡 a1+a2 proven (arcane even when blocked); a3 OPEN §7
 * (restrict gain-life unwired).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, rattleBonesRed } from "../../../fixtures.ts";

import { dreadScythe } from "../../../../../../cards/src/cards/weapons/dread-scythe.ts";

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
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("dread-scythe (MON229)", () => {
  it("a2: attack → 1 arcane to defending hero (3 physical + 1 arcane)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [dreadScythe],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    Bravo.activate(dreadScythe);
    game.helpers.resolveRestOfCombat();

    // 3 physical + a2's 1 arcane = 4.
    expect(Opp.life()).toBe(lifeBefore - 4);
  });

  it("a2 boundary: fully blocked physical → arcane still lands", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [dreadScythe],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [rattleBonesRed], deck: 6 },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    Bravo.activate(dreadScythe);
    // Rattle Bones (d3) blocks the 3 physical exactly — the a2 arcane still
    // resolves against the defending hero.
    Opp.defendWith(rattleBonesRed);
    drain(game);

    expect(Opp.life()).toBe(lifeBefore - 1);
  });
});
