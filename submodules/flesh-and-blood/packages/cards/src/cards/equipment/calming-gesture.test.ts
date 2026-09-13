import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { calmingGesture } from "./calming-gesture.ts";

/**
 * Calming Gesture (ROS250) — Illusionist Arms, Arcane Barrier 1.
 *
 * Printed: Instant - {r}, destroy this: Create a Spectral Shield token.
 */

describe("Calming Gesture (ROS250) AAA", () => {
  it("happy: Instant destroy creates a Spectral Shield", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        arms: [calmingGesture],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.activate(calmingGesture);
    game.passBoth();

    expectFabCard(Prism, calmingGesture).toBeIn("graveyard");
    expectFabPlayer(Prism).toHaveTokenCount("spectral-shield", 1).toHaveAP(1);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("spectral-shield", 0);
  });

  it("boundary: 0 resources cannot pay the Instant", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        arms: [calmingGesture],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.expectActivationRejected(calmingGesture);
    expectFabCard(Prism, calmingGesture).toBeIn("arms");
    expectFabPlayer(Prism).toHaveTokenCount("spectral-shield", 0);
  });

  it("timing: Instant spends no action point", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        arms: [calmingGesture],
        hand: [],
        resourcePoints: 1,
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.activate(calmingGesture);
    game.passBoth();

    expectFabPlayer(Prism).toHaveAP(0).toHaveTokenCount("spectral-shield", 1);
  });
});
