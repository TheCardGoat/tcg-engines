import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { grindingGearsBlue } from "./grinding-gears.ts";
import { zeroToSixtyRed } from "./zero-to-sixty.ts";
import { maximumVelocityRed } from "./maximum-velocity.ts";

describe("Maximum Velocity (ARC008) AAA", () => {
  it("happy: after boosting 3 times this turn this is legal and attacks for 10", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [zeroToSixtyRed, zeroToSixtyRed, zeroToSixtyRed, maximumVelocityRed],
        deck: [grindingGearsBlue, grindingGearsBlue, grindingGearsBlue],
        resourcePoints: 2,
        actionPoints: 1,
      },
      { hero: bravo, deck: 6, life: 20 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.attackWith(zeroToSixtyRed, { boost: true });
    game.advanceCombatTo("resolution");
    Dash.attackWith(zeroToSixtyRed, { boost: true });
    game.advanceCombatTo("resolution");
    Dash.attackWith(zeroToSixtyRed, { boost: true });
    game.advanceCombatTo("resolution");
    Dash.attackWith(maximumVelocityRed);

    expectCombat(game).toHaveAttackPower(10);
  });

  it("boundary: cannot be played without boosting 3 times this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [maximumVelocityRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6, life: 20 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    expectFabUnplayable(
      () => Dash.playAttack(maximumVelocityRed),
      /play condition is not satisfied/i,
    );
    expectFabCard(Dash, maximumVelocityRed).toBeIn("hand");
  });
});
