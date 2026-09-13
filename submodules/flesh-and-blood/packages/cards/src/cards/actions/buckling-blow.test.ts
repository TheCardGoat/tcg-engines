import { describe, expect, it } from "vitest";
import {
  FabTestEngine,
  expectFabCard,
  FAB_MANUAL_HARNESS,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravoShowstopper } from "../heroes/bravo-showstopper.ts";
import { dash } from "../heroes/dash.ts";
import { ironrotPlate } from "../equipment/ironrot-plate.ts";
import { nimblismBlue } from "./nimblism.ts";
import { bucklingBlowRed } from "./buckling-blow.ts";

describe("Buckling Blow family AAA", () => {
  it("happy: unblocked 8 dmg → crush puts -1{d} counter on opponent equipment", () => {
    const game = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        hand: [bucklingBlowRed],
        resourcePoints: 4,
        deck: 6,
      },
      { hero: dash, life: 40, chest: [ironrotPlate], hand: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);
    const Dash = game.as(dash);

    Bravo.attackWith(bucklingBlowRed);
    Dash.defendWith();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expect(Dash.life()).toBe(32); // 40 - 8
    expectFabCard(Dash, ironrotPlate).toHaveDefenseCounters(-1);
  });

  it("boundary: blocked below 4 damage → no crush trigger", () => {
    const game = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        hand: [bucklingBlowRed],
        resourcePoints: 4,
        deck: 6,
      },
      {
        hero: dash,
        life: 40,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);
    const Dash = game.as(dash);

    Bravo.attackWith(bucklingBlowRed);
    Dash.defendWith([nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    // 0 damage dealt to hero → crush trigger does NOT fire
    expect(Dash.life()).toBe(40);
  });

  it("timing: -1{d} counter persists across turns", () => {
    const game = FabTestEngine.start(
      { hero: bravoShowstopper, hand: [bucklingBlowRed], resourcePoints: 4, deck: 6 },
      { hero: dash, life: 40, chest: [ironrotPlate], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravoShowstopper);
    const Dash = game.as(dash);

    Bravo.attackWith(bucklingBlowRed);
    Dash.defendWith();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    expectFabCard(Dash, ironrotPlate).toHaveDefenseCounters(-1);

    Bravo.endTurn();
    game.helpers.resolveUntilIdle();
    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, ironrotPlate).toHaveDefenseCounters(-1);
  });
});
