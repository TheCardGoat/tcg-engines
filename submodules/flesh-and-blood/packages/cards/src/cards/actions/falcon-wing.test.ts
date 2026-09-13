import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { deathDealer } from "../shared/test-recipients.ts";
import { falconWingRed } from "./falcon-wing.ts";

/**
 * Falcon Wing (AZL008) — "If Falcon Wing has an aim counter, it has +1{p}.
 * Go again"
 *
 * Mode B (fab-rules): an aim counter is a named counter on the arrow itself;
 * the continuous static (condition has-counter aim + modify-numeric power) is
 * evaluated on the active attack while the arrow is on the combat chain. The
 * static-condition boundary is proven in both directions (aimed / unaimed),
 * plus the aimed bonus flowing through combat resolution.
 */

describe("Falcon Wing (AZL008) AAA", () => {
  it("happy: an aim counter on the arsenal arrow raises power from 3 to 4", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: falconWingRed, state: { aimCounters: 1 } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(azalea).attackWith(falconWingRed, { from: "arsenal" });

    expectCombat(game).toHaveAttackPower(4); // printed 3 + aimed 1
  });

  it("boundary: without an aim counter the arrow stays at printed power 3", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [falconWingRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(azalea).attackWith(falconWingRed, { from: "arsenal" });

    expectCombat(game).toHaveAttackPower(3); // condition false: no +1{p}
  });

  it("timing: the aimed arrow's +1{p} flows into combat damage on resolution", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: falconWingRed, state: { aimCounters: 1 } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(azalea).attackWith(falconWingRed, { from: "arsenal" });
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(16); // 20 - (3 + 1 aimed)
  });
});
