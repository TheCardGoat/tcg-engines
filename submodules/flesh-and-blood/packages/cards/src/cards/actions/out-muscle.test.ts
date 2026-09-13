import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { spinalCrushRed } from "./spinal-crush.ts";
import { nimblismBlue } from "./nimblism.ts";
import { outMuscleRed } from "./out-muscle.ts";

describe("Out Muscle (MON248) AAA", () => {
  it("happy: leftover AP after close at printed 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [outMuscleRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(outMuscleRed);
    expectCombat(game).toHaveAttackPower(6);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(game.as(bravo)).toHaveLife(14);
    expectFabPlayer(Dash).toHaveAP(1);
  });

  it("boundary: a miss deals no damage", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [outMuscleRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [nimblismBlue, nimblismBlue, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(outMuscleRed);
    Bravo.defendWith(nimblismBlue, nimblismBlue, nimblismBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Bravo).toHaveLife(20);
  });

  it("timing: a defender with equal or greater {p} strips go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [outMuscleRed, brutalAssaultBlue],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [spinalCrushRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(outMuscleRed);
    Bravo.defendWith(spinalCrushRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    expectFabPlayer(Dash).toHaveAP(0);
  });
});
