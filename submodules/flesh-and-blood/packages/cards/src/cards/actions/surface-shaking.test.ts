import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { surfaceShakingBlue } from "./surface-shaking.ts";

/**
 * Surface Shaking (SEA251) — Guardian Action Aura, cost 3.
 * Printed: Go again. When this enters the arena, create 3 Seismic Surge
 * tokens. At the beginning of your action phase, destroy this, then you may
 * put up to X cards from your hand on the bottom of your deck, where X is the
 * number of Seismic Surge tokens you control. Draw cards equal to the number
 * of cards put on the bottom this way.
 */

describe("Surface Shaking (SEA251) AAA", () => {
  it("happy: entering the arena creates 3 Seismic Surge tokens", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [surfaceShakingBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(surfaceShakingBlue);
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, surfaceShakingBlue).toBeIn("arena");
    expectFabPlayer(Bravo).toHaveTokenCount("seismic-surge", 3);
    expectFabPlayer(Bravo).toHaveAP(1);
  });

  it("boundary: the opponent receives none of the Seismic Surges", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [surfaceShakingBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).play(surfaceShakingBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(game.as(dash)).toHaveTokenCount("seismic-surge", 0);
  });

  it("timing: at the beginning of your next action phase this is destroyed", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [surfaceShakingBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(surfaceShakingBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Bravo, surfaceShakingBlue).toBeIn("arena");

    Bravo.endTurn();
    game.helpers.resolveUntilIdle();
    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle({
      ordering: "listed",
      optionals: "decline",
    });

    expectFabCard(Bravo, surfaceShakingBlue).toBeIn("graveyard");
  });
});
