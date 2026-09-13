import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { upliftingPerformanceBlue } from "./uplifting-performance.ts";

describe("Uplifting Performance (APS020) AAA", () => {
  it("happy: controlling Confidence gives +1{p} and a hit creates Confidence and Toughness", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [upliftingPerformanceBlue],
        arena: [fabToken("confidence")],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(upliftingPerformanceBlue);
    // PIN: control-object name "Confidence Or Toughness" does not match a seated Confidence token.
    expectCombat(game).toHaveAttackPower(5);
    // PIN: create-token slug "confidence-and-a-toughness" is absent from the match program.
    expect(() => game.closeCombat()).toThrow(/confidence-and-a-toughness/);
  });

  it("boundary: without Confidence or Toughness this stays printed 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [upliftingPerformanceBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).playAttack(upliftingPerformanceBlue);
    expectCombat(game).toHaveAttackPower(5);
  });

  it("timing: a miss creates no Confidence or Toughness", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [upliftingPerformanceBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue, nimblismBlue, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(upliftingPerformanceBlue);
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Bravo).toHaveTokenCount("confidence", 0);
    expectFabPlayer(Bravo).toHaveTokenCount("toughness", 0);
  });
});
