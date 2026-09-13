/**
 * AAZ004 Target Totalizer — Ranger Equipment Head (no defense).
 *
 * Printed (i18n):
 *   Action - Destroy this: Whenever an arrow with an aim counter hits this
 *   turn, draw a card. Go again
 *
 * Model (AAZ004-target-totalizer.ts):
 *   activated Action, cost destroy-self, layerKeywords goAgain,
 *   effect delayed-trigger {
 *     event: { name: hit, filter: { subtypes: [Arrow], hasCounter: aim }, per: turn },
 *     effect: draw 1 controller
 *   }
 *
 * Reasoning (printed vs model vs engine):
 * 1. Cost path is standard destroy-self Action — equipment leaves head for GY
 *    as the cost, not as an effect step. After resolve, activate is illegal.
 * 2. Go again must refund the Action AP spent to activate.
 * 3. The delayed clause is **whenever** (multi-fire) for the rest of **this
 *    turn**, not "the next time". Types document delayed-trigger as one-shot
 *    and register sets expiresAt:{kind:"triggered"} with consume-on-fire —
 *    that matches Kassai-style "next hit", not this card. Proving multi-fire
 *    is the core structural check for this row.
 * 4. Hit filter is the attacking object (combat hit primary): must be Arrow
 *    subtype AND carry a named aim counter. Non-arrow hits and aim-less arrows
 *    must leave the delayed clause armed without drawing.
 * 5. `event.per: "turn"` is a counting window on FabTriggerEvent, not a
 *    duration for multi-fire expiry. If multi-fire needs end-of-turn cleanup,
 *    that belongs on delayed-trigger duration / expiresAt, not event.per.
 * 6. No defense / bladeBreak — AAA does not defend with this equipment.
 *
 * Aim placement is not this card's text; arming aim on the arsenal arrow is a
 * test fixture (same pattern as production aim-arrow suites) so the hit filter
 * is the unit under test, not aim-counter generation.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, deathDealer, longShotRed, snatchRed } from "../../../fixtures.ts";
import { targetTotalizer } from "../../../../../../cards/src/cards/equipment/target-totalizer.ts";

describe("target-totalizer (AAZ004)", () => {
  it("core mechanic: destroy-self Action leaves head, registers delayed hit clause, go again refunds AP", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [targetTotalizer],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    expect(Bravo.zone("head")).toContain(targetTotalizer.canonicalId);

    Bravo.activate(targetTotalizer);
    game.passBoth();

    expect(Bravo.zone("head")).not.toContain(targetTotalizer.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(targetTotalizer.canonicalId);
    // Spent 1 AP for the Action; go again refunds it.
    expect(Bravo.actionPoints()).toBe(1);
    // Delayed clause must be armed for the rest of the turn (multi-fire window).
    expect(game.getState().delayedTriggers.length).toBeGreaterThanOrEqual(1);
    const delayed = game.getState().delayedTriggers[0]!;
    expect(delayed.trigger).toMatchObject({
      kind: "event",
      event: { name: "hit" },
    });
    expect(delayed.resolution).toMatchObject({
      kind: "effect",
      effect: { type: "draw", count: 1 },
    });
    // duration:this-turn → turn expiry (not one-shot kind:"triggered").
    expect(delayed.policy).toMatchObject({ kind: "windowed", expiresAt: { kind: "turn" } });
  });

  it("core mechanic: arrow with aim counter hits → controller draws 1", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [targetTotalizer],
        weapon1: [deathDealer],
        arsenal: [{ card: longShotRed, state: { aimCounters: 1 } }],
        hand: [],
        actionPoints: 2,
        // Long Shot is free; seed deck so a draw is observable.
        deck: 8,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(targetTotalizer);
    game.passBoth();
    expect(game.getState().delayedTriggers.length).toBeGreaterThanOrEqual(1);

    const handBefore = Bravo.handCount();
    Bravo.playFromArsenal(longShotRed, { target: Dash.id });
    game.helpers.resolveRestOfCombat();

    // Long Shot base 3 + aim continuous +2{p} = 5 unblocked; draw from the clause.
    expect(Dash.life()).toBe(15);
    expect(Bravo.handCount()).toBe(handBefore + 1);
  });

  it("boundaries: after destroy, activate is no longer legal", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [targetTotalizer],
        hand: [],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(targetTotalizer);
    game.passBoth();
    expect(() => Bravo.activate(targetTotalizer)).toThrow();
  });

  it("boundaries: non-arrow attack hit does not draw and leaves the delayed clause armed", () => {
    // Printed filter is Arrow + aim. An AAC hit must not satisfy the filter
    // and must not consume a multi-fire this-turn clause.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [targetTotalizer],
        hand: [snatchRed],
        actionPoints: 2,
        deck: 8,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(targetTotalizer);
    game.passBoth();
    expect(game.getState().delayedTriggers.length).toBeGreaterThanOrEqual(1);

    const handBefore = Bravo.handCount();
    Bravo.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expect(Bravo.handCount()).toBe(handBefore);
    // Multi-fire this-turn: non-matching hit must leave the clause armed.
    expect(game.getState().delayedTriggers.length).toBeGreaterThanOrEqual(1);
  });

  it("boundaries: arrow without aim counter hits does not draw", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [targetTotalizer],
        weapon1: [deathDealer],
        arsenal: [longShotRed],
        hand: [],
        actionPoints: 2,
        deck: 8,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(targetTotalizer);
    game.passBoth();

    const handBefore = Bravo.handCount();
    // No aim armed.
    Bravo.playFromArsenal(longShotRed, { target: Dash.id });
    game.helpers.resolveRestOfCombat();

    expect(Dash.life()).toBe(17);
    expect(Bravo.handCount()).toBe(handBefore);
  });

  it("boundaries: after an aimed-arrow hit the delayed clause stays armed (whenever, not next)", () => {
    // Structural: printed "Whenever … this turn" multi-fires. One-shot
    // delayed-trigger consumption (expiresAt:triggered + consume-on-fire) is
    // the wrong semantics if the clause is gone after the first matching hit.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [targetTotalizer],
        weapon1: [deathDealer],
        arsenal: [{ card: longShotRed, state: { aimCounters: 1 } }],
        hand: [],
        actionPoints: 2,
        deck: 8,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(targetTotalizer);
    game.passBoth();

    Bravo.playFromArsenal(longShotRed, { target: Dash.id });
    game.helpers.resolveRestOfCombat();

    // Matching hit must draw AND leave the this-turn clause armed for another hit.
    expect(Bravo.handCount()).toBeGreaterThanOrEqual(1);
    expect(game.getState().delayedTriggers.length).toBeGreaterThanOrEqual(1);
  });
});
