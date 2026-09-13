/**
 * SUP125 Gauntlets of Tyrannical Rex — Brute Arms d2 Temper.
 *
 * Printed:
 *   Action - {r}, {t}: Your next attack this turn gets +1{p}. Activate this
 *   only if there is a card with 6 or more {p} in your pitch zone. Go again
 *
 * Reasoning (hand-authored):
 * 1. Cost {r} + tap-self — mixed asset+effect cost (PEN017 magmatic-carapace
 *    tap+pay path; SEA009 rust-belt tap cost). The gauntlets STAY seated
 *    (tap only, no destroy) and the tap makes a second activation illegal.
 * 2. Gate: pitch-zone-has power ≥ 6 — wired evaluator; SUP126 overbearing-
 *    presence proved the same gate (brutal-assault p6 in pitch unlocks).
 * 3. Effect: floating next-attack +1{p} (appliesTo.next subtypes Attack) —
 *    punching-gloves SUP213 family.
 *
 * Status: ✅ {r}+tap with p6+ pitch → next attack +1{p} + go again; low-power
 * pitch / empty pitch / low RP illegal; tapped second-activate illegal.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";

import { gauntletsOfTyrannicalRex } from "../../../../../../cards/src/cards/equipment/gauntlets-of-tyrannical-rex.ts";
import { brutalAssaultRed } from "../../../../../../cards/src/cards/actions/brutal-assault.ts";

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

describe("gauntlets-of-tyrannical-rex (SUP125)", () => {
  it("core: p6+ in pitch → {r}+tap → next attack gets +1{p}; go again refunds AP", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [gauntletsOfTyrannicalRex],
        // Brutal Assault is power 6 — satisfies the pitch-zone-has gate.
        pitch: [brutalAssaultRed],
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    expect(Bravo.zone("pitch")).toContain(brutalAssaultRed.canonicalId);

    Bravo.activate(gauntletsOfTyrannicalRex);
    drain(game);

    // Tap-self: the gauntlets stay seated (not destroyed), RP spent, AP refunded.
    expect(Bravo.zone("arms")).toContain(gauntletsOfTyrannicalRex.canonicalId);
    expect(Bravo.resourcePoints()).toBe(0);
    expect(Bravo.actionPoints()).toBe(1);

    // Next attack (snatch, base 4) gets +1 → 5.
    Bravo.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(Opp.life()).toBe(lifeBefore - 5);

    // The tap was consumed: a second activation is illegal.
    expect(() => Bravo.activate(gauntletsOfTyrannicalRex)).toThrow();
  });

  it("boundary: activate illegal without a p6+ card in the pitch zone", () => {
    // Empty pitch.
    const empty = FabTestEngine.start(
      {
        hero: bravo,
        arms: [gauntletsOfTyrannicalRex],
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => empty.as(bravo).activate(gauntletsOfTyrannicalRex)).toThrow();
    expect(empty.as(bravo).zone("arms")).toContain(gauntletsOfTyrannicalRex.canonicalId);

    // Only low-power pitch (nimblism is not p6+).
    const low = FabTestEngine.start(
      {
        hero: bravo,
        arms: [gauntletsOfTyrannicalRex],
        pitch: [nimblismBlue],
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => low.as(bravo).activate(gauntletsOfTyrannicalRex)).toThrow();
  });

  it("boundary: insufficient resources illegal even with a legal pitch gate", () => {
    // No hand → nothing to pitch, so the {r} cost cannot be paid (the proven
    // SUP126 low-RP boundary pattern).
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [gauntletsOfTyrannicalRex],
        pitch: [brutalAssaultRed],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => game.as(bravo).activate(gauntletsOfTyrannicalRex)).toThrow();
  });
});
