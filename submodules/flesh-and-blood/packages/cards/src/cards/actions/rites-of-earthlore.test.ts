import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { ritesOfEarthloreRed } from "./rites-of-earthlore.ts";

/**
 * Rites of Earthlore (PEN026) — Guardian Action Aura, cost 0.
 * Printed: When this enters the arena, create a Seismic Surge token. At the
 * start of your turn, destroy this, then the next Guardian attack action card
 * you play this turn gets +3{p}.
 */

describe("Rites of Earthlore (PEN026) AAA", () => {
  it("happy: entering the arena creates a Seismic Surge token", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [ritesOfEarthloreRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(ritesOfEarthloreRed);
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, ritesOfEarthloreRed).toBeIn("arena");
    expectFabPlayer(Bravo).toHaveTokenCount("seismic-surge", 1);
  });

  it("boundary: the opponent receives none of the Seismic Surges", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [ritesOfEarthloreRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).play(ritesOfEarthloreRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(game.as(dash)).toHaveTokenCount("seismic-surge", 0);
  });

  it("timing: at the start of your next turn this is destroyed", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [ritesOfEarthloreRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(ritesOfEarthloreRed);
    game.helpers.resolveUntilIdle();
    expectFabCard(Bravo, ritesOfEarthloreRed).toBeIn("arena");

    Bravo.endTurn();
    game.helpers.resolveUntilIdle();
    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, ritesOfEarthloreRed).toBeIn("graveyard");
  });
});
