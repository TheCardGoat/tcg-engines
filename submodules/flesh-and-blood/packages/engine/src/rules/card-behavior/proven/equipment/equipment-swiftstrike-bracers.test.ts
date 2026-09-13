/**
 * SEA183 Swiftstrike Bracers — Generic Arms d0.
 *
 * Printed:
 *   Action - Destroy this: Your next attack this turn gets +2{p}. Activate this
 *   only if you've played a Nimblism this turn. Go again
 *
 * Reasoning (hand-authored):
 * 1. Activated Action — destroy-self cost; layerKeywords [goAgain] refunds the
 *    spent action point.
 * 2. Gate: has-status `played-a-nimblism-this-turn`. The catalog encodes the
 *    WTR Nimblism family (WTR218-220) as plain "Generic Action" cards — there
 *    is no Nimblism type-line — so this session wired a NEW engine fact
 *    `playerPlayedCardNamesThisTurn` (played card NAMES from play events) plus
 *    a has-status branch. No Nimblism played → activate illegal.
 * 3. Effect: modify-numeric power +2 with appliesTo.next subtypes Attack —
 *    floating next-attack aura (SUP213 punching-gloves family).
 * 4. Attack vehicle: snatchRed (attack action card, base 4). Nimblism Blue's
 *    own "+1{p} to the next cost≤1 attack action card" buff ALSO applies to
 *    snatch (cost 0), so the happy path asserts 4+2+1 = 7 and a delta
 *    boundary (Nimblism alone → 5) isolates the bracers' +2.
 *
 * Status: ✅ destroy after Nimblism → next attack +2{p} + go again; no-Nimblism
 * and wrong-card-played boundaries illegal.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, snatchRed } from "../../../fixtures.ts";

import { swiftstrikeBracers } from "../../../../../../cards/src/cards/equipment/swiftstrike-bracers.ts";

const LIFE = 40;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 48; safety += 1) {
    const decision = game.getState().decision;
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

describe("swiftstrike-bracers (SEA183)", () => {
  it("core: play Nimblism → destroy-self → next attack gets +2{p}; go again refunds AP", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [swiftstrikeBracers],
        hand: [nimblismBlue, snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    // Play the Nimblism (cost 0, go again) — arms the gate.
    Bravo.play(nimblismBlue);
    drain(game);
    expect(Bravo.zone("graveyard")).toContain(nimblismBlue.canonicalId);

    // Activate the bracers: destroy-self, go again refunds AP.
    Bravo.activate(swiftstrikeBracers);
    drain(game);
    expect(Bravo.zone("arms")).not.toContain(swiftstrikeBracers.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(swiftstrikeBracers.canonicalId);
    expect(Bravo.actionPoints()).toBe(1);

    // Next attack (snatch, base 4) gets +2 from the bracers AND +1 from
    // Nimblism Blue's own floating buff (next cost≤1 attack action card):
    // 4 + 2 + 1 = 7. The delta-2 boundary below isolates the bracers' +2.
    Bravo.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(Opp.life()).toBe(lifeBefore - 7);
  });

  it("delta: Nimblism alone (no bracers) leaves snatch at 5 — the +2 is the bracers", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [swiftstrikeBracers],
        hand: [nimblismBlue, snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    Bravo.play(nimblismBlue);
    drain(game);

    // No bracers activation: only Nimblism Blue's +1 applies → 4 + 1 = 5.
    Bravo.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(Opp.life()).toBe(lifeBefore - 5);
    expect(Bravo.zone("arms")).toContain(swiftstrikeBracers.canonicalId);
  });

  it("boundary: activate illegal without playing a Nimblism this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [swiftstrikeBracers],
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    expect(() => Bravo.activate(swiftstrikeBracers)).toThrow();
    expect(Bravo.zone("arms")).toContain(swiftstrikeBracers.canonicalId);
  });

  it("boundary: playing a different card (attack action) does not satisfy the Nimblism gate", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [swiftstrikeBracers],
        hand: [snatchRed],
        resourcePoints: 0,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    // Played an attack action card — "played a card", but not a Nimblism.
    Bravo.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    // Gate still closed: the bracers cannot activate.
    expect(() => Bravo.activate(swiftstrikeBracers)).toThrow();
    expect(Bravo.zone("arms")).toContain(swiftstrikeBracers.canonicalId);
  });
});
