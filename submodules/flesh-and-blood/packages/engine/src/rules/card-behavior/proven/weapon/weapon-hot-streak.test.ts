/**
 * HVY095 Hot Streak — Warrior Sword 1H — power 2.
 *
 * Printed:
 *   a1: Once per Turn Action - {r}: Attack
 *   a2: When this is defended by 1 or more attack action cards,
 *       Hot Streak's attacks get go again this turn.
 *
 * Status: 🟡→✅ — a2 triggered-on-defend-by-AAC → go again proven.
 * Card fix: removed spurious card-level goAgain keyword.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { dash, snatchRed } from "../../../fixtures.ts";

import { hotStreak } from "../../../../../../cards/src/cards/weapons/hot-streak.ts";
import { kassai } from "../../../../../../cards/src/cards/heroes/kassai.ts";

const LIFE = 40;

/** Drain decisions/stack until idle. Modeled on cintari-saber drain. */
function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 40; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "ordering") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "ordering", orderedIds: decision.entries.map((e) => e.id) },
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

describe("hot-streak (HVY095)", () => {
  it("a2: defended by AAC → go again (AP refund)", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        weapon1: [hotStreak],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [snatchRed], // Snatch Red: Action + Attack = AAC
        life: LIFE,
        deck: 6,
      },
      // Default autoPassPriority stops at defend step.
    );
    const Kassai = game.as(kassai);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    Kassai.activate(hotStreak);
    expect(game.combat()?.step).toBe("defend");
    // Defend with Snatch Red (AAC) — triggers a2.
    Opp.defendWith(snatchRed);
    drain(game);

    // Snatch d3 > 2{p} → 0 damage. AP refunded via a2 go again.
    expect(Opp.life()).toBe(lifeBefore);
    expect(Kassai.actionPoints()).toBe(1);
  });

  it("a2 boundary: not defended → no go again (AP spent)", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        weapon1: [hotStreak],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [], // no defenders
        life: LIFE,
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Kassai = game.as(kassai);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    Kassai.activate(hotStreak);
    game.helpers.resolveRestOfCombat();

    expect(Opp.life()).toBe(lifeBefore - 2); // 2 damage unblocked
    expect(Kassai.actionPoints()).toBe(0); // AP spent
  });
});
