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
import { throttleRed } from "../actions/throttle.ts";
import { zeroToSixtyBlue } from "../actions/zero-to-sixty.ts";
import { cogwerxBaseArms } from "./cogwerx-base-arms.ts";

/**
 * Cogwerx Base Arms (EVO016) — Mechanologist Base Arms.
 * Printed: "When this is equipped, put a steam counter on it. Once per Turn
 * Instant - {r}, remove a steam counter from this: Your next Mechanologist
 * attack this turn gets +1{p}. Activate this ability only if you've boosted
 * this turn."
 * Zero to Sixty (a real 0-cost Mechanologist attack) observes the +1{p}.
 */

describe("Cogwerx Base Arms (EVO016) AAA", () => {
  it("happy: boost unlocks the Instant; the next Mechanologist attack gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arms: [cogwerxBaseArms],
        hand: [throttleRed, zeroToSixtyBlue],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Dash, cogwerxBaseArms).toBeIn("arms");
    expectFabCard(Dash, cogwerxBaseArms).toHaveCounters(1, "steam");

    Dash.play(throttleRed, { boost: true });
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });
    game.helpers.resolveRestOfCombat();

    Dash.activate(cogwerxBaseArms);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });
    expectFabCard(Dash, cogwerxBaseArms).toHaveCounters(0, "steam");

    Dash.play(zeroToSixtyBlue, { boost: false });
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(3); // printed 2{p} + 1{p}
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveResourceCount(0); // 3 - 2 (throttle) - 1 (instant)
  });

  it("boundary: Instant is illegal without boosted-this-turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arms: [cogwerxBaseArms],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Dash, cogwerxBaseArms).toHaveCounters(1, "steam");
    Dash.expectActivationRejected(cogwerxBaseArms);
  });
});
