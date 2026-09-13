import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { snatchRed } from "./snatch.ts";
import { zeroToSixtyRed } from "./zero-to-sixty.ts";
import { overLoopBlue } from "./over-loop.ts";
import { lockedAndLoadedRed } from "./locked-and-loaded.ts";

/**
 * Locked and Loaded (ARC032) — Mechanologist Action (red).
 *
 * Printed:
 *   The next Mechanologist attack action card you play this turn gains +3{p}.
 *   If you have boosted this turn, opt 1.
 *   Go again
 *
 * fab-rules Mode B handoff:
 *   citations: CR 5.3 (resolution ability generates its effect when the
 *     card-layer resolves), CR 6.2 (layer-continuous modify-numeric bound to
 *     the next matching attack), CR 8.3 (Boost — boosted-this-turn status),
 *     CR 2.9 (power), go again refunds the action point spent.
 *   behaviorConstraints:
 *     - The +3{p} applies only to the controller's NEXT Mechanologist attack
 *       ACTION card played THIS TURN; a Generic (non-Mechanologist) attack
 *       receives nothing and does not consume the modifier.
 *     - The modifier is consumed by the first matching attack; a second
 *       Mechanologist attack the same turn is unbuffed.
 *     - Go again refunds the action point spent to play this.
 *   MODULE DEFECT RESOLVED (plan §5, W3-FIX3 2026-08-18): the unprinted
 *   `opt(1)` module keyword was removed; the printed conditional opt is the
 *   authored a2 (has-status boosted-this-turn → opt 1) and is asserted in
 *   both directions via the committed "opt" event.
 *   testImplications:
 *     - Assert Zero to Sixty (Mechanologist attack action, base 4) reads 7
 *       after Locked and Loaded; a Generic Snatch stays 4 while a later
 *       Mechanologist attack still reads 7; the second Mechanologist attack
 *       reads base 4; go again refunds the action point.
 */

describe("Locked and Loaded (ARC032) AAA", () => {
  it("happy: the next Mechanologist attack action this turn gains +3{p} and go again refunds", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [lockedAndLoadedRed, zeroToSixtyRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: azalea, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(lockedAndLoadedRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    // Go again refunded the action point spent on Locked and Loaded.
    expectFabPlayer(Dash).toHaveAP(2);

    Dash.must.playAttack(zeroToSixtyRed);
    game.advanceCombatTo("defend");
    // Zero to Sixty base 4 + 3 from Locked and Loaded = 7.
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: a Generic attack gets nothing and does not consume the modifier", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [lockedAndLoadedRed, snatchRed, zeroToSixtyRed],
        actionPoints: 3,
        deck: 6,
      },
      { hero: azalea, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(lockedAndLoadedRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    Dash.must.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    // Snatch is Generic: base 4, no +3.
    expectCombat(game).toHaveAttackPower(4);

    game.advanceCombatTo("resolution");
    Dash.must.playAttack(zeroToSixtyRed);
    game.advanceCombatTo("defend");
    // The modifier waited for a MECHANOLOGIST attack action: 4 + 3 = 7.
    expectCombat(game).toHaveAttackPower(7);
  });

  it("timing: the modifier is consumed by the first Mechanologist attack", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [lockedAndLoadedRed, zeroToSixtyRed, overLoopBlue],
        resourcePoints: 2,
        actionPoints: 3,
        deck: 6,
      },
      { hero: azalea, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(lockedAndLoadedRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    Dash.must.playAttack(zeroToSixtyRed);
    game.advanceCombatTo("defend");
    // First Mechanologist attack action: 4 + 3 = 7.
    expectCombat(game).toHaveAttackPower(7);

    game.advanceCombatTo("resolution");
    Dash.must.playAttack(overLoopBlue);
    game.advanceCombatTo("defend");
    // "Your NEXT ..." was consumed: the second attack is Overloop's base 3.
    expectCombat(game).toHaveAttackPower(3);
  });

  it("conditional opt happy: boosted this turn, playing this opts 1 exactly once", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [lockedAndLoadedRed, zeroToSixtyRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: azalea, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    // Boost with Zero to Sixty first: the banish-top-of-deck additional cost
    // stamps boosted-this-turn (CR 8.3).
    Dash.attackWith(zeroToSixtyRed, { boost: true });
    game.helpers.resolveRestOfCombat();

    Dash.play(lockedAndLoadedRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    // "If you have boosted this turn, opt 1" — exactly one opt event (the
    // removed unprinted keyword used to add a second, unconditional one).
    expect(game.committedEvents().filter((event) => event.name === "opt")).toHaveLength(1);
  });

  it("conditional opt boundary: without a boost this turn there is no opt", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [lockedAndLoadedRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: azalea, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(lockedAndLoadedRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    // No boost this turn: the printed conditional opt must NOT fire.
    expect(game.committedEvents().some((event) => event.name === "opt")).toBe(false);
  });
});
