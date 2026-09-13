/**
 * HVY050 Miller's Grindstone — Guardian Hammer 1H — power 4.
 *
 * Printed:
 *   a1: Once per Turn Action - {r}{r}{r}: Attack
 *   a2: When this hits a hero, clash with them. If you win, destroy the
 *       top card of their deck. If they win, put a -1{p} counter on this.
 *
 * Status: 🟡→✅ — a2 on-hit clash proven (win → destroy deck top;
 * lose → -1{p} counter). Rides proven clash engine (stonewall-impasse
 * HVY052). Deck seeding controls pitch comparison outcomes.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, swingBigRed } from "../../../fixtures.ts";

import { millerSGrindstone } from "../../../../../../cards/src/cards/weapons/miller-s-grindstone.ts";

const LIFE = 40;

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
    if (game.declareNoDefenseIfPending()) continue;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("miller-s-grindstone (HVY050)", () => {
  it("a2: win clash → destroy opponent deck top", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [millerSGrindstone],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, swingBigRed],
      },
      {
        hero: dash,
        hand: [],
        life: LIFE,
        deck: [swingBigRed, swingBigRed, swingBigRed, swingBigRed, swingBigRed, nimblismBlue],
      },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const deckBefore = Opp.zone("deck").length;

    Bravo.activate(millerSGrindstone);
    drain(game);

    expect(Opp.life()).toBe(LIFE - 4);
    expect(Opp.zone("deck")).toHaveLength(deckBefore - 1);
  });

  it("a2: lose clash → -1{p} counter on grindstone", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [millerSGrindstone],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: [swingBigRed, swingBigRed, swingBigRed, swingBigRed, swingBigRed, nimblismBlue],
      },
      {
        hero: dash,
        hand: [],
        life: LIFE,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, swingBigRed],
      },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);

    Bravo.activate(millerSGrindstone);
    drain(game);

    expect(Opp.life()).toBe(LIFE - 4);
    // -1{p} counter on weapon (stored in counters array, not markers).
    const state = game.getState();
    const weapon = state.objects[state.containers.zonesByPlayerId[Bravo.id]!.weapon1[0]!];
    const negPower = weapon?.counters?.filter(
      (c) => c.kind === "numeric" && c.property === "power" && c.value === -1,
    );
    expect(negPower).toHaveLength(1);
    expect(negPower![0]!.count).toBe(1);
  });
});
