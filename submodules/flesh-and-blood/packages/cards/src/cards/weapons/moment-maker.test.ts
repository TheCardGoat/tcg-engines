import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { tensionInTheAirYellow } from "../instants/tension-in-the-air.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { pleiadesSuperstar } from "../heroes/pleiades-superstar.ts";
import { momentMaker } from "./moment-maker.ts";

/**
 * Moment Maker (APS003) — Revered Guardian Weapon Hammer Axe 2H, 4{p}.
 *
 * Printed:
 *   Once per Turn Action - {r}{r}{r}: Attack
 *   If you control 3 or more auras of suspense, this gets +2{p} and
 *   "When this hits a hero, the crowd cheers you."
 */

describe("Moment Maker (APS003) AAA", () => {
  it("happy: with three auras of suspense the hammer hits for 6 and the crowd cheers", () => {
    // Arrange — Pleiades' hero trigger mints a Confidence whenever the crowd
    // cheers her, which makes the cheer player-visible.
    const game = FabTestEngine.start(
      {
        hero: pleiadesSuperstar,
        weapon1: [momentMaker],
        arena: [tensionInTheAirYellow, tensionInTheAirYellow, tensionInTheAirYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Pleiades = game.as(pleiadesSuperstar);
    const Dash = game.as(dash);

    // Act — attack with the suspense-gated static satisfied.
    Pleiades.activateAttack(momentMaker);
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat({ ordering: "listed" });

    // Assert — unblocked 6{p} lands and the cheer event fired (Confidence).
    expectFabPlayer(Dash).toHaveLife(14);
    expectFabPlayer(Pleiades).toHaveTokenCount("confidence", 1);
  });

  it("boundary: with fewer than three auras of suspense there is no +2{p} and no cheer", () => {
    // Arrange — only two Auras of Suspense seated.
    const game = FabTestEngine.start(
      {
        hero: pleiadesSuperstar,
        weapon1: [momentMaker],
        arena: [tensionInTheAirYellow, tensionInTheAirYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Pleiades = game.as(pleiadesSuperstar);
    const Dash = game.as(dash);

    // Act — same swing with the gate unsatisfied.
    Pleiades.activateAttack(momentMaker);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ ordering: "listed" });

    // Assert — base power hits and the crowd-cheers rider never armed.
    expectFabPlayer(Dash).toHaveLife(16);
    expectFabPlayer(Pleiades).toHaveTokenCount("confidence", 0);
  });

  it("boundary: a fully defended miss leaves the crowd silent even at three auras", () => {
    // Arrange — gate satisfied, but three 2{d} blocks absorb all 6{p}.
    const game = FabTestEngine.start(
      {
        hero: pleiadesSuperstar,
        weapon1: [momentMaker],
        arena: [tensionInTheAirYellow, tensionInTheAirYellow, tensionInTheAirYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Pleiades = game.as(pleiadesSuperstar);
    const Dash = game.as(dash);

    // Act
    Pleiades.activateAttack(momentMaker);
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat({ ordering: "listed" });

    // Assert — no hit means no cheer regardless of aura count.
    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Pleiades).toHaveTokenCount("confidence", 0);
  });
});
