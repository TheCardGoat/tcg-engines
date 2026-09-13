/**
 * CRU079 Cintari Saber — Warrior Sword 1H — power 2.
 *
 * Printed:
 *   a1: Once per Turn Action - {r}: Attack
 *   a2: Whenever Cintari Saber is defended by 1 or more attack action cards,
 *       it gains +1{p} until end of turn.
 *
 * Reasoning (hand-authored):
 * 1. a1 (1{r} 2-power attack, OPT) proven @ weapon-guardian-brute; this file
 *    proves the a2 defend-buff clause.
 * 2. a2 rides the cycle-4 engine fix `eventAmount(defend)→1`: the defend
 *    trigger with `comparison: {gte: 1}` now fires (previously the defend
 *    event's amount was 0 and the guard never matched).
 * 3. Happy: Snatch (attack ACTION card, d2) defends the saber → a2 fires →
 *    the saber's current attack deals 2+1-2 = 1. Boundaries: non-attack
 *    defender (Rattle Bones d3) does not trigger → 0; no defend → 2.
 *
 * Status: ✅ a2 +1{p} while defended by an attack action card proven;
 * non-attack/no-defend boundaries (a1 @ weapon-guardian-brute).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, rattleBonesRed } from "../../../fixtures.ts";

import { cintariSaber } from "../../../../../../cards/src/cards/weapons/cintari-saber.ts";

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

describe("cintari-saber (CRU079)", () => {
  it("a2: defended by an attack action card → +1{p} (2+1-2 = 1)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [cintariSaber],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [snatchRed], deck: 6 },
      // Default autoPassPriority: true — stops at the defend step.
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    Bravo.activate(cintariSaber);
    expect(game.combat()?.step).toBe("defend");
    // Snatch is an attack ACTION card (d2) — triggers the a2 buff.
    Opp.defendWith(snatchRed);
    drain(game);

    // 2{p} + 1 buff − 2 defense = 1 damage.
    expect(Opp.life()).toBe(lifeBefore - 1);
  });

  it("a2 boundary: defended by a non-attack action card → no buff", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [cintariSaber],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [rattleBonesRed], deck: 6 },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    Bravo.activate(cintariSaber);
    Opp.defendWith(rattleBonesRed);
    drain(game);

    // Rattle Bones (d3) is not an attack action card → 2 - 3 = 0.
    expect(Opp.life()).toBe(lifeBefore);
  });

  it("boundary: no defend → full 2 damage, no buff", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [cintariSaber],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    Bravo.activate(cintariSaber);
    game.helpers.resolveRestOfCombat();

    expect(Opp.life()).toBe(lifeBefore - 2);
  });
});
