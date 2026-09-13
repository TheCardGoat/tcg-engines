import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nerveScalpel } from "../weapons/nerve-scalpel.ts";
import { crushingImpact } from "./crushing-impact.ts";

/**
 * Crushing Impact (SMP021) — Event.
 *
 * Printed: The next time you would deal less than 4 damage this turn,
 * instead deal 4 damage.
 */

describe("Crushing Impact (SMP021) AAA", () => {
  it("pin: the sub-4 damage floor never applies (§5 engine/damage-comparison-replacement-unmatched)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [nerveScalpel],
        arena: [crushingImpact],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activateAttack(nerveScalpel);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(1);
    Dash.defendWith();
    game.helpers.resolveUntilIdle();

    // Printed: "instead deal 4 damage" — the replaces.comparison (lt 4) shape
    // is never evaluated by the matcher and DamageEventData carries no
    // playerId for the controller gate, so the floor never applies.
    expectFabPlayer(Dash).toHaveLife(19); // 20 - 1, floor dropped
  });

  it("boundary: without the Event the swing deals its printed 1", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [nerveScalpel],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activateAttack(nerveScalpel);
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(19); // 20 - 1
  });
});
