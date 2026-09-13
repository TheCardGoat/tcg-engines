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
import { longShotRed } from "./long-shot.ts";

/**
 * Long Shot (DYN165) — "If Long Shot has an aim counter, it has +2{p}."
 *
 * Mode B (fab-rules): the continuous static (condition has-counter aim +
 * modify-numeric power +2) is evaluated on the active attack from the
 * arsenal; both condition directions proven plus the resolution flow.
 */

describe("Long Shot (DYN165) AAA", () => {
  it("happy: an aim counter on the arsenal arrow raises power from 3 to 5", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: longShotRed, state: { aimCounters: 1 } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(azalea).attackWith(longShotRed, { from: "arsenal" });

    expectCombat(game).toHaveAttackPower(5); // printed 3 + aimed 2
  });

  it("boundary: without an aim counter the arrow stays at printed power 3", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [longShotRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(azalea).attackWith(longShotRed, { from: "arsenal" });

    expectCombat(game).toHaveAttackPower(3); // condition false: no +2{p}
  });

  it("timing: the aimed arrow's +2{p} flows into combat damage on resolution", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: longShotRed, state: { aimCounters: 1 } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(azalea).attackWith(longShotRed, { from: "arsenal" });
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(15); // 20 - (3 + 2 aimed)
  });
});
