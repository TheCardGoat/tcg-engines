import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { cosmicFlareRed } from "../instants/cosmic-flare.ts";
import { auroraShootingStar } from "./aurora-shooting-star.ts";

/**
 * Aurora, Shooting Star (ROS007) — Elemental Runeblade Hero.
 *
 * Printed: Once per Turn Instant - {r}{r}: Create an Embodiment of Lightning
 * token. Activate this only if you've played a Lightning card this turn.
 */

describe("Aurora Shooting Star (ROS007) AAA", () => {
  it("happy: after a Lightning card this turn, paying {r}{r} creates Embodiment of Lightning", () => {
    const game = FabTestEngine.start(
      {
        hero: auroraShootingStar,
        hand: [cosmicFlareRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Aurora = game.as(auroraShootingStar);

    Aurora.play(cosmicFlareRed);
    game.helpers.resolveUntilIdle();
    Aurora.activate(auroraShootingStar);
    game.passBoth();

    expectFabPlayer(Aurora).toHaveTokenCount("embodiment-of-lightning", 1);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("embodiment-of-lightning", 0);
  });

  it("boundary: cannot activate without playing a Lightning card this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: auroraShootingStar,
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Aurora = game.as(auroraShootingStar);

    Aurora.expectActivationRejected(auroraShootingStar);
    expectFabPlayer(Aurora).toHaveTokenCount("embodiment-of-lightning", 0);
  });

  it("boundary: once per turn — a second activation is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: auroraShootingStar,
        hand: [cosmicFlareRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Aurora = game.as(auroraShootingStar);

    Aurora.play(cosmicFlareRed);
    game.helpers.resolveUntilIdle();
    Aurora.activate(auroraShootingStar);
    game.passBoth();
    expectFabPlayer(Aurora).toHaveTokenCount("embodiment-of-lightning", 1);

    Aurora.expectActivationRejected(auroraShootingStar);
    expectFabPlayer(Aurora).toHaveTokenCount("embodiment-of-lightning", 1);
  });
});
