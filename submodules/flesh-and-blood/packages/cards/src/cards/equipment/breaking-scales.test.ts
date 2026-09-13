import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { risingKneeThrustRed } from "../actions/rising-knee-thrust.ts";
import { breakingScales } from "./breaking-scales.ts";

/**
 * Breaking Scales (KSU007) — Ninja Arms d1 Battleworn.
 *
 * Printed:
 *   Attack Reaction - Destroy Breaking Scales: Target attack action card with
 *   combo gains +1{p}.
 *   Battleworn
 *
 * Card-side fluent sibling of the engine proven suite
 * (packages/engine/.../proven/equipment/equipment-breaking-scales.test.ts):
 * happy proves the on-chain +1{p} through life math and the destroyed arms,
 * boundary shows a non-combo attack is not a legal subject, timing proves the
 * printed Battleworn −1{d} counter after defending.
 */

describe("Breaking Scales (KSU007) AAA", () => {
  it("happy: destroy the arms to give a combo attack +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [breakingScales],
        hand: [risingKneeThrustRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(risingKneeThrustRed);
    Dash.defendWith();
    game.toReaction("attacker");
    Bravo.activate(breakingScales);
    game.advanceUntil({
      stopAt: "resolution",
      entityTargets: "maximum",
      ordering: "listed",
    });
    expectCombat(game).toHaveAttackPower(4);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Bravo, breakingScales).toBeIn("graveyard");
  });

  it("boundary: a non-combo attack is not a legal subject", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [breakingScales],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(snatchRed);
    Dash.defendWith();
    game.toReaction("attacker");
    Bravo.expectActivationRejected(breakingScales);
    expectFabCard(Bravo, breakingScales).toBeIn("arms");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("timing: battleworn places a −1{d} counter after defending", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        arms: [breakingScales],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(snatchRed);
    Bravo.defendWith(breakingScales);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(17);
    expectFabCard(Bravo, breakingScales).toBeIn("arms");
    expectFabCard(Bravo, breakingScales).toHaveDefenseCounters(-1);
  });
});
