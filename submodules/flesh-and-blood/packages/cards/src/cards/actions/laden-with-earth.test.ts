import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { oldhimGrandfatherOfEternity } from "../heroes/oldhim-grandfather-of-eternity.ts";
import { fertileGroundBlue } from "../instants/fertile-ground.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { ladenWithEarthRed } from "./laden-with-earth.ts";

/**
 * Laden with Earth (PEN210) — Elemental Action, red.
 *
 * Printed: Your next attack this turn gets +3{p}. Earth Bond - If an Earth
 * card was pitched to play this, create an Embodiment of Earth token.
 * Go again
 */

describe("Laden with Earth (PEN210) AAA", () => {
  it("happy: pitching an Earth card creates Embodiment of Earth and the next attack gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhimGrandfatherOfEternity,
        hand: [ladenWithEarthRed, fertileGroundBlue, brutalAssaultBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhimGrandfatherOfEternity);

    Oldhim.play(ladenWithEarthRed, { pitch: [fertileGroundBlue] });
    game.helpers.resolveUntilIdle();

    expect(Oldhim.zone("arena")).toContain("token:embodiment-of-earth");
    expectFabCard(Oldhim, fertileGroundBlue).toBeIn("pitch");
    expectFabPlayer(Oldhim).toHaveAP(1);

    Oldhim.attackWith(brutalAssaultBlue);
    // Brutal Assault base 4 + 3 = 7.
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: without an Earth pitch there is no token, but the next attack still gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhimGrandfatherOfEternity,
        hand: [ladenWithEarthRed, nimblismBlue, brutalAssaultBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhimGrandfatherOfEternity);

    Oldhim.play(ladenWithEarthRed, { pitch: [nimblismBlue] });
    game.helpers.resolveUntilIdle();

    expect(Oldhim.zone("arena")).not.toContain("token:embodiment-of-earth");
    expectFabCard(Oldhim, nimblismBlue).toBeIn("pitch");

    Oldhim.attackWith(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(7);
  });

  it("timing: the +3{p} is this-turn only", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhimGrandfatherOfEternity,
        hand: [ladenWithEarthRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhimGrandfatherOfEternity);
    const Dash = game.as(dash);

    Oldhim.play(ladenWithEarthRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Oldhim).toHaveAP(1);

    Oldhim.endTurn();
    Dash.endTurn();
    game.helpers.untilIdle();

    Oldhim.attackWith(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });
});
