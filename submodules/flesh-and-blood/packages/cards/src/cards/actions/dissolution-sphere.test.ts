import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { dissolutionSphereYellow } from "./dissolution-sphere.ts";

/**
 * Dissolution Sphere Yellow (EVR069) — Mechanologist Item.
 *
 * Printed: Dissolution Sphere enters the arena with a steam counter on it.
 * At the beginning of your action phase, destroy Dissolution Sphere unless
 * you remove a steam counter from it.
 */

describe("Dissolution Sphere (EVR069) AAA", () => {
  it("happy: enters with a steam counter; the next action phase consumes it, the turn after destroys", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [dissolutionSphereYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(dissolutionSphereYellow);
    game.helpers.resolveUntilIdle();
    expectFabCard(Dash, dissolutionSphereYellow).toBeIn("arena");
    expectFabCard(Dash, dissolutionSphereYellow).toHaveCounters(1, "steam");

    // Turn cycle 1: the action-phase start removes the counter (kept alive).
    Dash.endTurn();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum", optionalBoolean: true });
    game.as(bravo).endTurn();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum", optionalBoolean: true });
    expectFabCard(Dash, dissolutionSphereYellow).toBeIn("arena");
    expectFabCard(Dash, dissolutionSphereYellow).toHaveCounters(0, "steam");

    // Turn cycle 2: no counter left to remove — destroyed.
    Dash.endTurn();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum", optionalBoolean: true });
    game.as(bravo).endTurn();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum", optionalBoolean: true });
    expectFabCard(Dash, dissolutionSphereYellow).toBeIn("graveyard");
  });
});
